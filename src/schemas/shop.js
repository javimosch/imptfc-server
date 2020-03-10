import mongoose from 'mongoose'

var schema = new mongoose.Schema({
    name: String
}, {
    timestamps: true,
    collection: 'shop'
});
mongoose.model('shop', schema);