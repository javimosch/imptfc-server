import dotenv from 'dotenv'
import express from 'express'
import { configureConnection, sessionMiddleware, dbMiddleware } from './db.js'
import jwt from './jwt.js';
import { createRequire } from 'module';
import configureFunql from './funql.js'
import cors from 'cors'
import configureDynamicRestfulApi from './crud.js'

dotenv.config({ silent: true })

const app = express()
const port = process.env.PORT || 3000

app.use((req,res,next)=>{
    console.log('REQ',req.url)
    next();
})

app.use(cors())
app.use(express.json({
    limit: "100mb"
}))
app.get('/alive', (req, res) => {
    res.json({
        ok: true
    })
})

async function init() {
    await configureConnection()

    app.use(dbMiddleware())
    app.use(sessionMiddleware())

    await configureDynamicRestfulApi(app)
    await configureFunql(app)
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}
init().catch(console.error)


/*
app.get('/', async (req, res) => {

    req.session.jwt_token = await jwt.sign({
        name: req.query.name
    })
    res.send('Hello World!')
})

app.use('/users', (()=>{

    let users = express.Router()
    users.post('/', usersApi.create)
    users.get('/', usersApi.read)
    return users;

})())

app.get('/jwt/token', async (req, res) => {
    res.json(req.session.jwt_token)
})

app.post('/post', async (req, res) => {
    console.log(req.body)
    res.send('Hello World! '+JSON.stringify(req.body))
})*/