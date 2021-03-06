const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    name:{
        type : String,
        required : [true , 'Iltimos ismingizni kiriting'],
        trim: true
    },
    email:{
        type : String,
        required : [true , 'Iltimos pochtangizni kiriting'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ , 'Iltimos pochtangizni tekshiring'],
        unique : [true , `Bu pochta allaqachon registratsiyadan o'tgan`],
        trim: true,
        
    },
    password: {
        type : String,
        required : [true , 'Iltimos parolni kiriting'],
        trim: true,
        select: false
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

userSchema.pre('save' , async function(next) {
    if(!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password , salt);
});
  
//  Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare( enteredPassword, this.password);
}
module.exports = mongoose.model('User', userSchema)