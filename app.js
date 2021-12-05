const fs = require('fs')
const express = require('express')
const app = express();
const ejs = require('ejs')
const path = require('path');
var multer = require('multer')

app.use(express.static(path.join(__dirname + 'uploads')));

// app.use(express.static('public'))
app.use(express.static('uploads'));

var bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ScreenSHotSnipet', { useNewUrlParser: true, useUnifiedTopology: true });

const data = new mongoose.Schema({
    fileName: String,
    fileInfo: String
});

const Data = mongoose.model('Data', data);


app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/home', (req, res) => {
    res.render('home')
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});


const upload = multer({
    storage: storage
})

app.post('/fileUpload', upload.single('uploaded_file'), async(req,res,next)=>{
    var fileInfo = req.file.filename;
    var fileName = req.body.fileInfo;
    await Data.create({ fileInfo, fileName })

    res.redirect('/result')
    
})


app.get('/result', async (req, res) => {

    const findData = await Data.find({})
    res.render('result', { findData })
})


// const helpers  = function (req, file, cb) {
//     // Accept images only
//     if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
//         req.fileValidationError = 'Only image files are allowed!';
//         return cb(new Error('Only image files are allowed!'), false);
//     }
//     cb(null, true);
// };
// app.post('/fileUpload', upload, async (req, res) => {

//     // upload(req, res, async (err) => {
//     //     if (err) {
//     //         res.render('home', { msg: err })
//     //     }

//     const { fileInfo } = req.body
//     const { fileName } = req.file
//     console.log(req.file.filename);
//     console.log(fileName);
//     await Data.create({ fileInfo, fileName })
//     // console.log(`${result} 32 32 32`);
//     res.redirect('/result')

//     // })
// });



app.listen(3000, () => {
    console.log("Server running on port 3000");
})