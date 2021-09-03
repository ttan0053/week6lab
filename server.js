const express = require('express');
const morgan = require('morgan')
const app = express();
const mongoose = require('mongoose');
const Doctor = require('./models/doctor.js');
const Patient = require('./models/patient');
const patient = require('./models/patient');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.urlencoded({extended: true}));
app.use(express.static('images'));
app.use(express.static('css'));
app.use(morgan("common"));

mongoose.connect('mongodb://localhost:27017/libDB', function (err) {
    if (err) {
        console.log('Failed to connect');
        throw err;
    }

    console.log('Successfully connected');
})

let viewsPath = __dirname + "/views/";

//homepage
app.get('/', function(req, res) {
    let fileName = viewsPath + "index.html";
    res.sendFile(fileName);
});

//add new doctor
app.get("/getadddoctor", function(req,res) {
    let fileName = viewsPath + "adddoctor.html";
    res.sendFile(fileName);
});

//list all doctors
app.get("/getalldoctors", function(req,res) {
    Doctor.find({}, function (err, data) {
        res.render("alldoctors", {doctors: data});
    });
});

//add new patient
app.get("/getaddpatient", function(req,res) {
    let fileName = viewsPath + "addpatient.html";
    res.sendFile(fileName);
});

//list all patient
app.get("/getallpatients", function(req,res) {
    Patient.find({}, function (err, data) {
        if(err) throw err;
        Doctor.find({}, function (err, docs) {
            res.render("allpatients", {patients: data, doctors: docs});
        })
    });
});

//delete 
app.get("/deletebyname", function (req, res) {
    let fileName = viewsPath + "deletebyname.html";
    res.sendFile(fileName)
});

//delete doc by id
app.get("/deletedocbyid", function (req, res) {
    let fileName = viewsPath + "deletedoctorbyid.html";
    res.sendFile(fileName)
});

//update book by title
app.get("/updatedoctor", function (req, res) {
    let fileName = viewsPath + "updatedoctor.html";
    res.sendFile(fileName);
});

//POST requests
app.post("/postnewdoctor", function(req, res) {
    console.log(req.body);

    if (req.body.firstName < 2 || req.body.firstName > 3) {
        let fileName = viewsPath + "invalid.html";
        res.sendFile(fileName);
    } else { 
        let newDoctor = new Doctor({
            _id: new mongoose.Types.ObjectId(),
            fullName: {
                firstName: req.body.firstName,
                lastName: req.body.lastName
            },
            dob: req.body.dob,
            address: {
                state: req.body.state,
                suburb: req.body.suburb,
                street: req.body.suburb,
                unit: req.body.unit
            },
            numPatients: req.body.numPatients
        });
        
        newDoctor.save(function (err) {
            if (err) {
                throw err;
            }
        });
            
        res.redirect("/getalldoctors");
    }
});

app.post("/postnewpatient", function(req, res) {
    console.log(req.body);

    let newPatient = new Patient({
        _id: new mongoose.Types.ObjectId(),
        fullName: req.body.fullName,
        doctor: mongoose.Types.ObjectId(req.body.doctorId),
        age: req.body.age,
        dateOfVisit: req.body.dateOfVisit,
        caseDesc: req.body.caseDesc
    });

    //update doctor patients
    Doctor.findByIdAndUpdate(newPatient.doctor, {$inc: {numPatients: 1}}, function (err, data) {
        console.log(data);
    });

    newPatient.save(function (err) {
        if (err) {
            let fileName = viewsPath + "invalid.html";
            res.sendFile(fileName);
            throw err;
        }
    })
        
    res.redirect("/getallpatients");
});

//delete patients
app.post("/deletebyname", function (req, res) {    
    Patient.deleteMany({'fullName': req.body.fullName}, function (err, doc) {
        console.log(doc);
    });
    res.redirect("/getalldoctors");
});

//delete doctor
app.post("/deletedocbyid", function (req, res) {
    Doctor.findByIdAndDelete(req.body.docId, function (err, docs) {
        if (err) throw err;
    })   
    Patient.deleteMany({'doctor': req.body.docId}, function (err, doc) {
        if (err) throw err;
        console.log(doc);
    }); 
    res.redirect("/getallpatients");
});

app.post("/updatedoctor", function (req, res) {
    let updateData = {
        $set: {
            numPatients: req.body.newNumPatients
        },
    };
    Doctor.findByIdAndUpdate(req.body.doctorId, updateData, function (err, docs) {
        if (err) { 
            throw err;
        }
        console.log(docs);
    });

    res.redirect("/getalldoctors");
});


app.all("/*", function (req,res) {
    let fileName = viewsPath + "error.html";
    res.sendFile(fileName);
});

app.listen(8080);
