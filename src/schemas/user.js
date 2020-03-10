import mongoose from 'mongoose'


var userRoleSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    description: String,
    org: { type: 'ObjectId', ref: 'org', required: true },
}, {
    timestamps: false,
    collection: 'user_role'
});
var UserRoleModel = mongoose.model('user_role', userRoleSchema);

var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    bornDate: Date,
    password: String,
    enabled: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    collection: 'user'
});
var UserModel = mongoose.model('user', userSchema);