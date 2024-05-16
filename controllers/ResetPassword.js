const User = require("../modals/User");
const SendEmail = require("../mail/SendEmail");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { UpdatePassword } = require("../mail/UpdatePassword");
exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("email", email);
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `There is no account found corresponding this email id ${email} `,
      });
    }

    const token = crypto.randomBytes(20).toString("hex");
    // update user by setting the new token
    const updateUser = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        // token expires with in 10 minutes
        resetPasswordExpires: Date.now() + 10 * 60 * 1000,
      },
      { new: true }
    );

    console.log("Updated user Schema is ", updateUser);
    const url = `http://localhost:3000/update-password/${token}`;

    await SendEmail(
      email,
      "Password Reset Link",
      `Password Reset Link, Please click here to change the password ${url}`
    );
    return res.status(200).json({
      success: true,
      message: "Reset Password Email sent successfully",
      token: updateUser.token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Error Occured While Sending  Reset Password Link ",
    });
  }
};

exports.resetPassword = async (req, res) => {
  // we need 3 things first is token ,second is password and confirm_password

  const { password, confirm_password, token } = req.body;
  if (confirm_password !== password) {
    return res.status(400).json({
      success: false,
      message: "Password and Confirm Password values are not matching !!",
    });
  }

  const userDetails = await User.findOne({ token: token });
  console.log("Given user by given token", userDetails);

  if (!userDetails) {
    return res.status(403).json({
      success: false,
      message: `Token is invalid, Please regenerate the Reset Password link  `,
    });
  }

  // check the token time agar token kee validity end ho gai ho tab
  if (userDetails.resetPasswordExpires < Date.now()) {
    return res.status(403).json({
      success: false,
      message: `Token has expired, Please regenerate it.} `,
    });
  }

  console.log("user email is ==>", userDetails.email);

  let hashPassword;

  try {
    hashPassword = await bcrypt.hash(password, 10);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error occured while hashing the password ",
      error: error.message,
    });
  }

  const getUser = await User.findOneAndUpdate(
    { token: token },
    {
      password: hashPassword,
    },
    { new: true }
  );
  console.log("upadetd user is", getUser);
  //create the url for frent-end
  const url = `http://localhost:3000/login`;
  await SendEmail(
    `${getUser.email}`,
    "Password Reset Successfully ",
    UpdatePassword(getUser.email, getUser.fullName, url)
  );
  res.status(200).json({
    success: true,
    message: " Password Reset successfully",
    token: getUser.token,
  });
};
