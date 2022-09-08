const express = require('express');
const mongoose = require("mongoose");
const route = require('./routes/route.js');
const app = express();

app.use(express.json());


mongoose.connect("mongodb+srv://SekharMohanta:6VSdjALwpC9DyChf@cluster0.brxpv.mongodb.net/Reunion_DB", {

    useNewUrlParser: true
    
})

.then( () => console.log("MongoDB is connected...."))

.catch ( err => console.log(err) )

app.use('/', route);

app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});