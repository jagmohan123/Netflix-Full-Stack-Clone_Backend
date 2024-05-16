// import { User } from "../modals/User.js";
const User = require("../modals/User");
// for hasing the password
// import bcryptjs from "bcryptjs";
const bcrypt = require("bcryptjs");
// import { jwt } from "jsonwebtoken";
const jwt = require("jsonwebtoken");

// Register User
exports.SignUp = async (req, res) => {
  try {
    // step 1-> take user data  like fullName, email,password from body
    const { fullName, email, password } = req.body;
    // step 2-> validate the data all feilds are mandetory
    if (!fullName || !email || !password) {
      return res.status(401).json({
        success: false,
        message: "All the feilds are required",
      });
    }

    // step-3 check also user is already register with given email id if yes so return
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(401).json({
        success: false,
        message: `User already registered with this email id ${email}`,
      });
    }

    // step -4 so hash our password so no one can see our password
    let hashPassword;

    try {
      hashPassword = await bcrypt.hash(password, 10);
      console.log("HashPassword is ", hashPassword);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error while hasing the password up!!",
        error: error.message,
      });
    }
    // step-5 so all is fine so create the entry in db
    // jo bhi aap eske andar pass kar rhe hai vo modals ke andar name hai unse match hone chaheaye
    const newUser = await User.create({
      fullName,
      email: email,
      password: hashPassword,
    });

    console.log("created user", newUser);

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while signing up!!",
      error: error.message,
    });
  }
};

// Login User
exports.Login = async (req, res) => {
  try {
    // step1 get the email id and password from req body
    const { email, password } = req.body;
    // step2 vaidate the data
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: `Email id and password both are required`,
      });
    }

    // step3 check the account if account exist so we can login otherwise we have to create the account

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: `No Account found corresponding to given email id ${email}`,
      });
    }
    console.log("User data =>", user);

    // if the password is created so we have to create the JWT Token
    if (await bcrypt.compare(password, user.password)) {
      // create a JWT Token
      // we can make the json data opbject and direct pass
      let token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // before give the response we make sure we have to
      //  set the password undefined so user can not view the password in response

      // some time need to convert here no need to convert thats why we made comment

      // user = user.toObject();
      user.token = token;
      user.password = undefined;
      // console.log("token", token);

      // you can pass simple data without token and create the cookie
      // return res.status(200).json({
      //   success: true,
      //   message: "User Login Successfully",
      //   data: user,
      // });

      // we need to make the option for creting the cookie
      let options = {
        // cookie expires in 3 days
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      // 1st is the name of the cookie, 2nd us token value and 3rd is options

      return res.cookie("token", token, options).status(200).json({
        success: true,
        message: `Login Successfully`,
        token,
        user,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Please  enter correct password ",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while Loging up!!",
      error: error.message,
    });
  }
};

// Logout User
exports.Logout = async (req, res) => {
  return res.cookie("token", "").status(200).json({
    success: true,
    message: `Logout Successfully`,
  });
};

// Change Password
