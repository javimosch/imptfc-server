import mongoose from 'mongoose'
var projectSchema = new mongoose.Schema({
    orgs: [{ type: 'ObjectId', ref: 'org', required: false }],
    slug: {
        unique: true,
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    public: {
        type: Boolean,
        required: true,
        default: true
    },
    users: [new mongoose.Schema({
        user: { type: 'ObjectId', ref: 'user', required: true },
        category: { type: 'ObjectId', ref: 'category', required: true }
    })],
    articles: [{ type: 'ObjectId', ref: 'article', required: false }]
}, {
    timestamps: true,
    collection: 'project'
});
var ProjectModel = mongoose.model('project', projectSchema);