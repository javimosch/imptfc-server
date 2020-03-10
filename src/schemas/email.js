import mongoose from 'mongoose'

var emailSchema = new mongoose.Schema({
    type: String,
    sended: {
        type: Boolean,
        default: false
    },
    events: [new mongoose.Schema({
        type: String,
        metadata: Object
    })],
    sended_date: Date,
    metadata: Object,
    owner: { type: 'ObjectId', ref: 'user', required: false },
    org: { type: 'ObjectId', ref: 'org', required: false },
}, {
    timestamps: true,
    collection: 'email'
});
var EmailModel = mongoose.model('email', emailSchema);