const express = require("express")
const {engine} = require("express-handlebars")
const bodyParser = require("body-parser")
const path = require("path")
const app = express()
const port = 3000


app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.use("/",require(path.join(__dirname,"./Routes/home.js")))
app.use(express.static("./assets/images"))


app.listen(port,() => {
    console.log(`Listening at http://localhost:${port}`);
})
