const mongoose = require('mongoose')

const OTPtemplate = new mongoose.Schema({
    otp: {
        type: String,
    },
    email: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('otpTable', OTPtemplate);