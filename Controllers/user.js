const { default: mongoose } = require("mongoose");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const sgMail = require("@sendgrid/mail");
let { sendEmail } = require("../Controllers/emailVerify.js");

const { MONGO_URI } = process.env;

const _uiUrl_ = "http://127.0.0.1:3000/#";
const _senderMail_ = "dev@satorixr.com";
const _senderMailPassword_ = "aivkxcwvollxqwgv";
const _verifyAccountLink_ = _uiUrl_ + "/verify-account/";

var connection = mongoose.connection;
var otp;

exports.register = function (req, res, next) {
  otp = Math.random();
  otp = otp * 1000000;
  otp = parseInt(otp).toString();

  const collection = connection.collection("users");
  const data = req.body;
  collection.findOne(
    { email: data.emailOrPhone ? data.emailOrPhone : data.email },
    (err, user) => {
      if (err) {
        console.log("Error occurred while finding user:", err);
        return res.status(500).json({ error: "Failed to register" });
      }

      if (user) {
        return res.status(409).json({ error: "Email already registered" });
      }

      let newData;
      if (data.phoneNumber !== "") {
        newData = {
          email: data.email,
          otp: "",
          phoneNumber: data.phoneNumber,
          password: data.password,
          ConfirmPassword: data.confirmPassword,
        };
      } else {
        newData = {
          email: data.emailOrPhone,
          otp: otp,
          password: data.password,
          ConfirmPassword: data.confirmPassword,
        };
      }

      const htmlcode = `<table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #ccc;">
    <tr>
      <td>
        <table width="600" border="0" align="center" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <div style="padding:0 30px;background:#fff">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="font-size:18px;padding:20px 0">
                      <table border="0" cellspacing="0" cellpadding="0" width="100%">
                        <tr>
                          <td>
                            <center>
                              <img src="logo.png" alt="Logo" width="200" height="100">
                            </center>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size:18px;padding:20px 0">
                      <center>
                        <span style="font-size: 24px; font-weight: bold;">Email Verification</span>
                      </center>
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size:14px;line-height:30px;padding:0 0 20px;color:#666">
                      <center>
                        <p>Here is your OTP:</p>
                        <table cellspacing="10" cellpadding="0" style="font-size: 24px;">
                          <tr>
                            ${otp
                              .split("")
                              .map(
                                (letter) =>
                                  `<td style="border: 1px solid #000; width: 50px; height: 50px; text-align: center;">${letter}</td>`
                              )
                              .join("")}
                          </tr>
                        </table>
                        <p style="font-size: 14px; color: #666; padding-top: 20px;">DO NOT REPLY TO THIS MESSAGE. IF YOU HAVE ANY QUESTIONS, PLEASE CONTACT US AT <a href="mailto:your_email@example.com" style="color: blue; text-decoration: underline;">your_email@example.com</a>. </p>
                      </center>
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 14px; color: #666; text-align: left;">
                      <p>Thanks,</p>
                      <p>Support Team</p>
                      <p>Contact: <a href="mailto:test@example.com" style="color: blue; text-decoration: underline;">test@example.com</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;

      sendEmail(
        data.email ? data.email : data.emailOrPhone,
        _senderMail_,
        "hello from satorixr",
        htmlcode
      );

      // Insert the new user data into the database
      collection.insertOne(newData, (err, doc) => {
        if (err) {
          console.log("Error occurred while inserting:", err);
          return res.status(500).json({ error: "Failed to register" });
        }

        const result = { data: "Create successfully" };
        res.send(result);
      });
    }
  );
};

exports.getOtp = function (req, res, next) {
  console.log("otpvalue", otp);
  res.send(otp);
};

exports.getGoogle = function (req, res, next) {
  const collection = connection.db.collection("users");
  const data = req.body;

  const newData = {
    First_Name: data.firstName,
    Last_Name: data.lastName,
    Email: data.email,
    Phone_Number: data.phoneNumber,
    // Address: data.address,
  };

  collection.insertOne(newData, (err, doc) => {
    if (err) {
      console.log("Error occurred while inserting:", err);
      return res.status(500).json({ error: "Failed to register" });
    }
  });

  const result = { data: "Create successfully" };
  res.send(result);
};

exports.verifyEmail = function (req, res, next) {
  const { email } = req.body;
  console.log(email);
  const collection = connection.collection("users");

  collection
    .findOne({ email }, function (err, user) {
      if (err) {
        console.error("Error occurred while finding the user:", err);
        const errorMessage = "An error occurred while finding the user";
        return res.status(500).send({ message: errorMessage });
      }

      if (!user) {
        const errorMessage = "Email is incorrect!";
        return res.status(400).send({ message: errorMessage });
      }
    })
    .catch((error) => {
      console.log("Error occurred while verifying email:", error);
      return res.status(500).json({ error: "Failed to verify email" });
    });
};

exports.generateOTP = function (req, res, next) {
  otp = Math.random();
  otp = otp * 1000000;
  otp = parseInt(otp).toString();
  const { email } = req.body;
  const collection = connection.collection("users");

  const newData = {
    email: email,
    // otpsignin: otp,
    otp: otp,
  };
  console.log(newData);
  const htmlcode = `<table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #ccc;">
  <tr>
    <td>
      <table width="600" border="0" align="center" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <div style="padding:0 30px;background:#fff">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-size:18px;padding:20px 0">
                    <table border="0" cellspacing="0" cellpadding="0" width="100%">
                      <tr>
                        <td>
                          <center>
                            <img src="logo.png" alt="Logo" width="200" height="100">
                          </center>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="font-size:18px;padding:20px 0">
                    <center>
                      <span style="font-size: 24px; font-weight: bold;">Email Verification</span>
                    </center>
                  </td>
                </tr>
                <tr>
                  <td style="font-size:14px;line-height:30px;padding:0 0 20px;color:#666">
                    <center>
                      <p>Here is your OTP:</p>
                      <table cellspacing="10" cellpadding="0" style="font-size: 24px;">
                        <tr>
                          ${otp
                            .split("")
                            .map(
                              (letter) =>
                                `<td style="border: 1px solid #000; width: 50px; height: 50px; text-align: center;">${letter}</td>`
                            )
                            .join("")}
                        </tr>
                      </table>
                      <p style="font-size: 14px; color: #666; padding-top: 20px;">DO NOT REPLY TO THIS MESSAGE. IF YOU HAVE ANY QUESTIONS, PLEASE CONTACT US AT <a href="mailto:your_email@example.com" style="color: blue; text-decoration: underline;">your_email@example.com</a>. </p>
                    </center>
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 14px; color: #666; text-align: left;">
                    <p>Thanks,</p>
                    <p>Support Team</p>
                    <p>Contact: <a href="mailto:test@example.com" style="color: blue; text-decoration: underline;">test@example.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;

  sendEmail(email, _senderMail_, "hello from satorixr", htmlcode);
  const datainfo = { otp: otp };
  const dataUpdate = { $set: datainfo };
  const dataCondition = { email: email };
  // const newdata = { $set: item };
  collection.updateOne(dataCondition, dataUpdate);
  result = {
    status: "success",
    message:
      "Congratulations",
  };
  res.send(result);

  // collection.updateOne(newData, (err, doc) => {
  //   if (err) {
  //     console.log("Error occurred while inserting:", err);
  //     return res.status(500).json({ error: "Failed to register" });
  //   }

  //   const successMessage = "OTP generated successfully";
  //   return res.send({ message: successMessage });
  // });
};

exports.otpVerify = function (req, res, next) {
  const { email, otp } = req.body;
  // console.log("email",email);

  const collection = connection.collection("users");

  collection.findOne({ email }, function (err, user) {
    if (err) {
      console.log("Error occurred while verifying OTP:", err);
      return res.status(500).json({ error: "Failed to verify OTP" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found or invalid OTP" });
    }
    console.log("user", user);
    if (otp === user.otp) {
      return res.status(200).json({ success: "OTP verification successful" });
    } else {
      return res.status(401).json({ error: "Invalid OTP" });
    }
  });
};

exports.passwordVerify = function (req, res, next) {
  const { email, password } = req.body;
  console.log(email);
  const collection = connection.collection("users");

  collection.findOne({ email }, function (err, user) {
    if (err) {
      console.log("Error occurred while verifying email:", err);
      return res.status(500).json({ error: "Failed to verify email" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (password === user.password) {
      return res.status(200).json({ success: "Login successful" });
    } else {
      return res.status(401).json({ error: "Invalid password" });
    }
  });
};
