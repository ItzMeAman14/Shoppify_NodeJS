const express = require("express")
const {engine} = require("express-handlebars")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const path = require("path")
const app = express()
const port = 3000


app.use(express.json())
app.use(express.urlencoded({extended:false}))
// app.engine('ejs', engine());
app.set('view engine', 'ejs');
app.use("/",require(path.join(__dirname,"./Routes/home.js")))
app.use(express.static("./assets/images"))
app.use(express.static("./uploads"))


app.listen(port,() => {
    console.log(`Listening at http://localhost:${port}`);
})
