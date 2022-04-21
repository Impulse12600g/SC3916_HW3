var mongoose = require('mongoose');
var MovieSchema = new mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
const {Schema} = require("mongoose");
mongoose.Promise = global.Promise;
//from users.js
try {//creat env variable and use new parser
    mongoose.connect( process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
        console.log("connected"));
}catch (error) {
    console.log("could not connect");
}
mongoose.set('useCreateIndex', true);

//shcema
var moviesSchema = new Schema(
    {
        title:{type: String, required: true},
        year: {type: Number, required: true},
        genre: {type: String, required: true},
        actors: [
            {actorname: {type: String, required: true}},
            {charactername:{type: String, required: true}}],
    });


module.exports = mongoose.model("Movies", MovieSchema);//return