const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "youremail@gmail.com",
    pass: "yourpassword",
  },
});

function sendMail(mail, test) {
  const mailOptions = {
    from: "youremail@gmail.com",
    to: mail,
    subject: "Sending Email using Node.js",
    text: "That was easy!",
  };
  if('test'){
    return true;
  }else{
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          return false;
        } else {
          console.log("Email sent: " + info.response);
          return true;
        }
      });
  }
  
}

module.exports = {
  sendMail,
};
