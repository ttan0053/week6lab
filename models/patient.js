const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

let patientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    
    fullName: {
        type: String,
        required: true
    },

    doctor: {
        type: mongoose.Schema.Types.ObjectId
    },

    age: {
        type: Number,
        validate: {
            validator: function (ageValue) {
                return ageValue >= 0 && ageValue <= 120;
            },
            message: 'Age should be a number between 0 and 120'
        }
    },

    dateOfVisit: {
        type: Date,
        default: Date.now
    },

    caseDesc: {
        type: String,
        validate: {
            validator: function (caseDescStr) {
                return caseDescStr.length >= 10;
            },
            message: 'Case Description should be at least 10 characters'
        }
    }
});

module.exports = mongoose.model('Patient', patientSchema);