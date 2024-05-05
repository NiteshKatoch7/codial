const mongoose = require('mongoose');

const resetPasswordSchema = new mongoose.Schema({
    auth: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});

const resetPassword = mongoose.model('resetPassword', resetPasswordSchema);
module.exports = resetPassword;

