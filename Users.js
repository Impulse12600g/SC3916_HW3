var mongoose = require('mongoose'); // conected to mongo db on atlas
var Schema = mongoose.Schema;// schema obj
var bcrypt = require('bcrypt-nodejs');// encript our passwords

mongoose.Promise = global.Promise;//override mongoose promise to use global

//mongoose.connect(process.env.DB, { useNewUrlParser: true });
try {//creat env variable and use new parser
    mongoose.connect( process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
        console.log("connected"));
}catch (error) {
    console.log("could not connect");
}
mongoose.set('useCreateIndex', true);// create indexes as part of our schema

//user schema
var UserSchema = new Schema({
    name: String,
    username: { type: String, required: true, index: { unique: true }},//username required
    password: { type: String, required: true, select: false }// dont want it to be selectable
});

UserSchema.pre('save', function(next) {// hash the password for us
    var user = this;// access to user

    //hash the password
    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) return next(err);

        //change the password
        user.password = hash;// pass is now a hash rep of pass
        next();// call the next
    });
});

UserSchema.methods.comparePassword = function (password, callback) {// create a nice method that takes a func callback
    var user = this;

    bcrypt.compare(password, user.password, function(err, isMatch) {// if match or not
        callback(isMatch);// if match
    })
}

//return the model to server
module.exports = mongoose.model('User', UserSchema);