const express = require("express");
const app = express()
require('dotenv').config()
var cors = require('cors')
const PORT = process.env.PORT || 8080;
var fs = require('fs');
const { RSA_NO_PADDING } = require("constants");
var fileName = './ImageList.json';
var file = require(fileName);

app.use(cors())
app.use(express.json())


app.get('/image-list', (req, res) => {
    res.send(file);
})

app.post('/image-list-add', (req, res) => {
    const { label } = req.body;
    const { url } = req.body;
    file = [{label, url}, ...file]
    fs.writeFile(fileName, JSON.stringify(file), function (err) {
      if (err) res.send(err)
    });
    res.send({"response": "Success"})
})

app.post('/image-list-delete', (req, res) => {
    const { index } = req.body;
    const { password } = req.body;
    if(password === process.env.PASSWORD) {
    let imageNr = +index + 1;
    let firstPart = file.slice(0, imageNr - 1);
    let lastPart = file.slice(imageNr, file.length);
    file = [...firstPart, ...lastPart]
    fs.writeFile(fileName, JSON.stringify(file), function (err) {
      if (err) res.send(err)
    });
    res.send({"Response": "Success"})
    } else {
    res.send({"Response": "Wrong Password"})
    }
})


app.listen(PORT, () => console.log('Server Running at Port' + PORT))