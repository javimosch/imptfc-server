import mongoose from 'mongoose'

var schema = new mongoose.Schema({
    slug: {
        unique: true,
        type: String
    },
    title: {
        type: String,
        required: true
    },
    draft: {
        type: Boolean,
        required: true,
        default: true
    },
    authors: [{ type: 'ObjectId', ref: 'user', required: false }],
    articles: [{ type: 'ObjectId', ref: 'article', required: false }]
}, {
    timestamps: true,
    collection: 'article'
});
mongoose.model('article', schema);