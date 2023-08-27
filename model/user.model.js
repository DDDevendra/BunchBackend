import mongoose from "mongoose";
import bunch from "./bunch.model.js"
import message from './message.model.js'
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({

    UserName:{
        type:"String",
        unique:[true,"UserName in Use "],
        require:[true,"Enter UserName"]
    },

    email:{
        type:"String",
        unique:[true,"Email in Use"],
        require:[true,"Enter Email"]

    },

    password:{
        type:String
    },

    bio:{
        type:String
    },

    profileImg:{
        type:String
    },

    followers:[{
        
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserSchema',
    }],

    followings:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserSchema',
    }],

    bunch:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'bunch'
    }],

    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserSchema'
    }],

    isend:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'message'
    }],

    igot:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'message'
    }]
})


UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
  
    try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(this.password, salt);
      this.password = hashPassword;
      next();
    } catch (e) {
      console.log("Failed to hash!");
    }
  });

export default mongoose.model('user',UserSchema);