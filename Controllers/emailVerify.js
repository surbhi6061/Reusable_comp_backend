let sgMail = require('@sendgrid/mail');


exports.sendEmail = function (receiver, source, subject, content) {
  
    const API_KEY =
    "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";

  sgMail.setApiKey(API_KEY);

  const message = {
    from: source,
    to: receiver,
    subject: subject,
    html: content,
  };
  sgMail
    .send(message)
    .then((response) => console.log("email sent..."))
    .catch((error) => console.log(error.message));
};