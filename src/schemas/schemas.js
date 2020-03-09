import mongoose from 'mongoose'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import sander from 'sander'
import path from 'path'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let files = sander.readdirSync(__dirname)
files.forEach(f=>{
    if(f!=='schemas.js'){
        import(path.join(__dirname,f)).then(()=>{
            console.log('schema loaded',f)
        })
    }
})

var categorySchema = new mongoose.Schema({
    type:{
        type:String,
        required:true,
        enum:["project_role","article_category"]
    },
    code:{ 
        type:String,
        unique:true,
        required:true
    },
    parent:{
        type:"ObjectId",
        red:"category",
        default:null
    }
});
const CategoryModel = mongoose.model('category', categorySchema);


//PROJECT
var projectSchema = new mongoose.Schema({
    orgs: [{ type: 'ObjectId', ref: 'org', required:false }],
    slug: {
        unique:true,
        type:String,
        required:true
    },
    name: {
        type:String,
        required:true
    },
    public:{
        type:Boolean,
        required:true,
        default:true
    },
    users:[new mongoose.Schema({
        user:{ type: 'ObjectId', ref: 'user', required:true },
        category: { type: 'ObjectId', ref: 'category', required:true }
    })],
    articles: [{ type: 'ObjectId', ref: 'article', required:false }]
},{
    timestamps:true
});
var ProjectModel = mongoose.model('project', projectSchema);

//ARTICLE
var articleSchema = new mongoose.Schema({
    slug: {
        unique:true,
        type:String
    },
    title: {
        type:String,
        required:true
    },
    draft:{
        type:Boolean,
        required:true,
        default:true
    },
    authors: [{ type: 'ObjectId', ref: 'user', required:false }],
    articles: [{ type: 'ObjectId', ref: 'article', required:false }]
},{
    timestamps:true
});
var ArticleModel = mongoose.model('article', articleSchema);

//EMAIL
var emailSchema = new mongoose.Schema({
    type: String,
    sended: {
        type:Boolean,
        default:false
    },
    events:[new mongoose.Schema({
        type:String,
        metadata: Object
    })],
    sended_date: Date,
    metadata: Object,
    owner: { type: 'ObjectId', ref: 'user', required:false },
    org: { type: 'ObjectId', ref: 'org', required:false },
},{
    timestamps:true
});
var EmailModel = mongoose.model('email', emailSchema);

//USER ROLES
var userRoleSchema = new mongoose.Schema({
    code:{
        type:String,
        unique:true,
        required:true
    },
    description: String,
    org: { type: 'ObjectId', ref: 'org', required:true },
},{
    timestamps:false
});
var UserRoleModel = mongoose.model('user_role', userRoleSchema);

//USER
var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    bornDate: Date,
    password: String,
    enabled:{
        type: Boolean,
        default:false
    }
},{
    timestamps:true
});
var UserModel = mongoose.model('user', userSchema);

//SHOP
var shopSchema = new mongoose.Schema({
    name: String
},{
    timestamps:true
});
var shopModel = mongoose.model('shop', shopSchema);

//ORGANIZATION USER
var orgUserSchema = new mongoose.Schema({
    user: { type: 'ObjectId', ref: 'user', required:true },
    role: { type: 'ObjectId', ref: 'user_role', required:true}
});
var OrgUserModel = mongoose.model('org_user', orgUserSchema);

//ORGANIZATION
var orgSchema = new mongoose.Schema({
    name: String,
    users: [orgUserSchema],
    child_orgs: [{ type: 'ObjectId', ref: 'organization' }],
    federated_by: { type: 'ObjectId', ref: 'federation' }
},{
    timestamps:true
});
var OrgModel = mongoose.model('org', orgSchema);

