const mongoose = require('mongoose');

let doctorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    
    fullName: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },

    dob: Date,

    address: {
        state: {
            type: String,
            validate: {
                validator: function (stateValue) {
                    return stateValue.length >= 2 && stateValue.length <= 3;
                },
                message: 'State should have MIN of 2 and MAX of 3 characters'
            }
        },
        suburb: String,
        street: String,
        unit: String
    },

    numPatients: {
        type: Number,
        validate: {
            validator: function (patientCount) {
                return patientCount >= 0;
            },
            message: 'Number of Patients should be a positive number'
        }
    }
});

module.exports = mongoose.model('Doctor', doctorSchema);