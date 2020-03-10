import mongoose from 'mongoose'



//ORGANIZATION USER
var orgUserSchema = new mongoose.Schema({
    user: { type: 'ObjectId', ref: 'user', required: true },
    role: { type: 'ObjectId', ref: 'user_role', required: true }
});
var OrgUserModel = mongoose.model('org_user', orgUserSchema);

//ORGANIZATION
var orgSchema = new mongoose.Schema({
    name: String,
    users: [orgUserSchema],
    child_orgs: [{ type: 'ObjectId', ref: 'organization' }],
    federated_by: { type: 'ObjectId', ref: 'federation' }
}, {
    timestamps: true,
    collection: 'org'
});
var OrgModel = mongoose.model('org', orgSchema);