// Import required modules
const express = require('express');
const multer = require('multer');
const tesseract = require("node-tesseract-ocr");
const fs = require('fs');
const path = require('path');

// Initialize Express app
const app = express();

// Serve static files from the 'uploads' directory
app.use(express.static(path.join(__dirname, '/uploads')));
// Set the view engine to EJS
app.set('view engine', "ejs");

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

const upload = multer({ storage: storage });

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  // File uploaded successfully
  res.send('File uploaded!');
});

// Render index page
app.get('/', (req, res) => {
  res.render('index', { data: '' });
});

// Extract text from uploaded image using Tesseract
app.post('/extracttextfromimage', upload.single('file'),(req, res)=>{
  console.log(req.file.path)

  // Tesseract configuration
  const config = {
   lang: "eng", // Language set to English
   oem: 1,
   psm: 3,
 }
 
 // Perform OCR on the uploaded image
 tesseract
   .recognize(req.file.path, config)
   .then((text) => {
     console.log("Result:", text);

     // Render the index page with extracted text
     res.render('index', {data:text})
   })
   .catch((error) => {
     console.log(error.message)
   })
})

// Start the server
app.listen(5000, () => {
  console.log("App is listening on port 5000");
});
