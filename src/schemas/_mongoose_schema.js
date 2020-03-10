import mongoose from 'mongoose'
var schema = new mongoose.Schema({
    name: {
        unique: true,
        type: String,
        required: true
    },
    contents: {
        type: String,
        required: true,
        default: `
//mongoose is available as global variable
//import / require is forbidden

var schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
});
mongoose.model('category', schema);
        `
    }
}, {
    timestamps: true,
    collection: 'mongoose_schema'
});
mongoose.model('mongoose_schema', schema);