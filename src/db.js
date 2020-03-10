import mongoose from 'mongoose'
import session from 'express-session'
import ConnectMongo from 'connect-mongo'
import sander from 'sander'
import path from 'path'
import uniqid from 'uniqid'
import tmpDir from 'temp-dir'

var MongoStore;
var mongoURI;

let model = mongoose.model
mongoose.model = (() => {
    let collections = {}

    return function(name, definition = null) {
        if (definition) {
            let id = uniqid(`${name}-`)
            collections[name] = {
                    id,
                    model: model.apply(mongoose, [id, definition])
                }
                //console.log(`Applying model ${name} <=> ${id}`)
            return collections[name].model
        } else {
            return collections[name].model
        }
    }
})();

async function loadSchemas() {
    let dirs = await sander.readdir(path.join('src/schemas'))
    await Promise.all(dirs.map(dir => {
        console.log('schema load', dir)
        return import (`./schemas/${dir}`)
    }))
    await loadSchemasFromDatabase()
}

async function loadSchemasFromDatabase() {
    let schemas = await mongoose.model('mongoose_schema').find({})

    if (schemas.length === 0) {
        await mongoose.model('mongoose_schema').create({
            name: "cake",
            contents: `
            mongoose.model('cake', new mongoose.Schema({
                cake_name:String
            },{
                collection: 'cake'
            }))
            `
        })
    }

    await Promise.all(schemas.map(schema => {
        return (async function() {
            let schemaPath = path.join(tmpDir, `schema-${schema.name}.js`)
            let forbiddenStrings = ['import', 'require']
            if (forbiddenStrings.filter(s => schema.contents.indexOf(s) !== -1).length > 0) {
                console.log(`The schema ${schema.name} contains forbidden keywords: `, forbiddenStrings);
                return
            }
            let schemaContents =
                `
module.exports = async function bootstrap({mongoose}){
    ${schema.contents}
}
            `
            await sander.writeFile(schemaPath, schemaContents)
            let moduleBootstrap = await
            import (schemaPath)
            await moduleBootstrap.default({
                mongoose
            })
            console.log('schema load', schema.name)
        })()
    }))

}

export async function configureConnection() {
    if (mongoose.connection.readyState === 0) {
        MongoStore = ConnectMongo(session)
        mongoURI = process.env.MONGO_URI
        if (!mongoURI) throw new Error('MONGO_URI')
        mongoose.connect(mongoURI, { useNewUrlParser: true });
        await loadSchemas()
    }
}

const singleton = {
    collection(name) {
        return {
            model() {
                return mongoose.model(name)
            }
        }
    }
}

export function dbMiddleware() {
    return function(req, res, next) {
        req.db = singleton
        req.model = name => mongoose.model(name)
        next();
    }
}

export function sessionMiddleware() {

    const mongoStoreOptions = {
        url: mongoURI,
        //mongoOptions: advancedOptions // See below for details
    }
    return session({
        saveUninitialized: false,
        resave: false, //don't save session if unmodified
        secret: 'secret',
        store: new MongoStore(mongoStoreOptions)
    });
}