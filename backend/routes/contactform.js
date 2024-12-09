const router = require("express").Router();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const { googleOauthConfig } = require("../configure/config");

const myOAuth2Client = new OAuth2(
  googleOauthConfig.clientId,
  googleOauthConfig.clientSecret
  // "https://developers.google.com/oauthplayground"
);

myOAuth2Client.setCredentials({
  refresh_token: googleOauthConfig.refreshToken,
});

const myAccessToken = myOAuth2Client.getAccessToken();

// "/" = /api/contactform/
router.post("/", async (req, res) => {
  console.log("post req.body: ", req.body);

  const createHtmlBody = () =>
    `<html>
      <body>
        <h3>Contact form submitted:</h3></br>
        Email: ${req.body.email}<br/>
        Comment: ${req.body.message}<br/>
      </body>
    </html>`;

  const mailOptions = {
    from: '"muistocks"<admin@pensquared.com>',
    to: googleOauthConfig.user,
    subject: "Contact form submitted",
    html: createHtmlBody(),
  };

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: googleOauthConfig.user,
      clientId: googleOauthConfig.clientId,
      clientSecret: googleOauthConfig.clientSecret,
      refreshToken: googleOauthConfig.refreshToken,
      accessToken: myAccessToken,
    },
  });

  transport.sendMail(mailOptions, (error, result) => {
    if (error) {
      res.send({ message: error });
    } else {
      transport.close();
    }
    res.send({ message: "message was sent to pensquaredllc@gmail.com" });
  });
});

module.exports = router;
