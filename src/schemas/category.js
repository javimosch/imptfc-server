import mongoose from 'mongoose'
var categorySchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ["project_role", "article_category"]
    },
    code: {
        type: String,
        unique: true,
        required: true
    },
    parent: {
        type: "ObjectId",
        red: "category",
        default: null
    }
}, {
    collection: 'category'
});
mongoose.model('category', categorySchema);