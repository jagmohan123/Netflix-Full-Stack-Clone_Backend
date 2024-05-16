// import mongoose from "mongoose"
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    resetPasswordExpires: {
      type: Date,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

// jo aapne export const User (variable me assign keaya hai kosis kare esi se export kare jaise User Variable tha or User name se hee export keaya hai )
// export const User = mongoose.model("User", UserSchema);

// best way
module.exports = mongoose.model("user", UserSchema);
