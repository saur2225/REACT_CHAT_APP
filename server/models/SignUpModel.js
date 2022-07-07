const mongoose = require('mongoose')

const signUpTemplate = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        // required: true
    },
    uniqueId: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    messages: {
        type: [],
    }
})

module.exports = mongoose.model('myTable', signUpTemplate);