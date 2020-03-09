import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    slug: {
        unique:true,
        type:String,
        required:true
    },
    title: {
        type:String,
        required:true
    },
    short_description:{
        type:String,
        required:false
    },
    body:new mongoose.Schema({
        contents:{
            type:String
        },
        format:{
            type:String,
            enum:["MD","PUG","HTML","PLAIN"]
        }
    }),
    author: { type: 'ObjectId', ref: 'user', required:false },
    users:{
        type: [new mongoose.Schema({
            user:{ type: 'ObjectId', ref: 'user', required:true },
            status: { type: String, enum:['INTERESTED',"GOING"], required:true }
        })],
        default:[],
        required:true
    }
},{
    timestamps:true
});
mongoose.model('event', schema);