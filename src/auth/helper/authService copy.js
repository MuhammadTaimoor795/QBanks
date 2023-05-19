require("dotenv");
const db = require("../../../models");
const crypto = require("crypto");

const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const { ApiError } = require("../../utils/error");

const nodemailer = require("nodemailer");
const config = require("../config.json");

// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SEND_GRID_API);

// // Send Grid
// const sendEmail = async ({
//   to,
//   subject,
//   html,
//   from = process.env.VerifiedEmail,
// }) => {
//   try {
//     const sendemail = {
//       to,
//       from,
//       subject,
//       html,
//     };
//     const fina = await sgMail.send(sendemail);
//     return fina[0].statusCode;
//   } catch (error) {
//     throw new ApiError(error.message, { status: 500 });
//   }
// };

async function sendEmail({ to, subject, html, from = config.emailFrom }) {
  const transporter = nodemailer.createTransport(config.smtpOptions);
  await transporter.sendMail({ from, to, subject, html });
}

async function sendVerificationEmail(account) {
  let Url = `${process.env.SERVER_PATH}/api/user/verify?token=${account.verificationToken}`;
  // console.log("email hit2 ", verifyUrl);
  let sendemail = await sendEmail({
    to: account.email,
    subject: "Sign-up Verification API - Verify Email",
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"><head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <style type="text/css">
  body, p, div {
    font-family: inherit;
    font-size: 14px;
  }
  body {
    color: #000000;
  }
  body a {
    color: #1188E6;
    text-decoration: none;
  }
  p { margin: 0; padding: 0; }
  table.wrapper {
    width:100% !important;
    table-layout: fixed;
    -webkit-font-smoothing: antialiased;
    -webkit-text-size-adjust: 100%;
    -moz-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }
  img.max-width {
    max-width: 100% !important;
  }
  .column.of-2 {
    width: 50%;
  }
  .column.of-3 {
    width: 33.333%;
  }
  .column.of-4 {
    width: 25%;
  }
  @media screen and (max-width:480px) {
    .preheader .rightColumnContent,
    .footer .rightColumnContent {
      text-align: left !important;
    }
    .preheader .rightColumnContent div,
    .preheader .rightColumnContent span,
    .footer .rightColumnContent div,
    .footer .rightColumnContent span {
      text-align: left !important;
    }
    .preheader .rightColumnContent,
    .preheader .leftColumnContent {
      font-size: 80% !important;
      padding: 5px 0;
    }
    table.wrapper-mobile {
      width: 100% !important;
      table-layout: fixed;
    }
    img.max-width {
      height: auto !important;
      max-width: 100% !important;
    }
    a.bulletproof-button {
      display: block !important;
      width: auto !important;
      font-size: 80%;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
    .columns {
      width: 100% !important;
    }
    .column {
      display: block !important;
      width: 100% !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
  }
  </style>
  <link href="https://fonts.googleapis.com/css?family=Muli&display=swap" rel="stylesheet"><style>
  body {font-family: 'Muli', sans-serif;}
  </style>
  </head>
  <body>
    <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:inherit; color:#000000; background-color:#FFFFFF;">
      <div class="webkit">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF">
          <tbody><tr>
            <td valign="top" bgcolor="#FFFFFF" width="100%">
              <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                <tbody><tr>
                  <td width="100%">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tbody><tr>
                        <td>
  
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                    <tbody><tr>
                                      <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
  <tbody><tr>
    <td role="module-content">
      <p></p>
    </td>
  </tr>
  </tbody></table><table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:30px 20px 30px 20px;" bgcolor="#f6f6f6">
  <tbody>
    <tr role="module-content">
      <td height="100%" valign="top">
        <table class="column" width="540" style="width:540px; border-spacing:0; border-collapse:collapse; margin:0px 10px 0px 10px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="">
          <tbody>
            <tr>
              <td style="padding:0px;margin:0px;border-spacing:0;"><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="72aac1ba-9036-4a77-b9d5-9a60d9b05cba">
  <tbody>
    <tr>
      <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
        <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;" width="29" alt="" data-proportionally-constrained="true" data-responsive="false" src="http://cdn.mcauto-images-production.sendgrid.net/954c252fedab403f/9200c1c9-b1bd-47ed-993c-ee2950a0f239/29x27.png" height="27">
      </td>
    </tr>
  </tbody>
  </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="331cde94-eb45-45dc-8852-b7dbeb9101d7">
  <tbody>
    <tr>
      <td style="padding:0px 0px 20px 0px;" role="module-content" bgcolor="">
      </td>
    </tr>
  </tbody>
  </table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="d8508015-a2cb-488c-9877-d46adf313282">
  <tbody>
    <tr>
      <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
        <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;" width="95" alt="" data-proportionally-constrained="true" data-responsive="false" src="http://cdn.mcauto-images-production.sendgrid.net/954c252fedab403f/61156dfa-7b7f-4020-85f8-a586addf4288/95x33.png" height="33">
      </td>
    </tr>
  </tbody>
  </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="27716fe9-ee64-4a64-94f9-a4f28bc172a0">
  <tbody>
    <tr>
      <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
      </td>
    </tr>
  </tbody>
  </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="948e3f3f-5214-4721-a90e-625a47b1c957" data-mc-module-version="2019-10-22">
  <tbody>
    <tr>
      <td style="padding:50px 30px 18px 30px; line-height:36px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="font-size: 43px">Welcome on Dragon of Midgard Reloaded ${account.username}!&nbsp;</span></div><div></div></div></td>
    </tr>
  </tbody>
  </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="a10dcb57-ad22-4f4d-b765-1d427dfddb4e" data-mc-module-version="2019-10-22">
  <tbody>
    <tr>
      <td style="padding:18px 30px 18px 30px; line-height:22px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="font-size: 18px">Please verify your email address to</span><span style="color: #000000; font-size: 18px; font-family: arial,helvetica,sans-serif"> get access to Dragon of Midgard Reloaded</span><span style="font-size: 18px">.</span></div>
  <div style="font-family: inherit; text-align: center"><span style="color: #F195FF; font-size: 18px"><strong>Thank you!&nbsp;</strong></span></div><div></div></div></td>
    </tr>
  </tbody>
  </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="7770fdab-634a-4f62-a277-1c66b2646d8d">
  <tbody>
    <tr>
      <td style="padding:0px 0px 20px 0px;" role="module-content" bgcolor="#ffffff">
      </td>
    </tr>
  </tbody>
  </table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="d050540f-4672-4f31-80d9-b395dc08abe1">
    <tbody>
      <tr>
        <td align="center" bgcolor="#ffffff" class="outer-td" style="padding:0px 0px 0px 0px;">
          <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
            <tbody>
              <tr>
              <td align="center" bgcolor="#ffbe00" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                <a href=${Url} style="background-color:#F195FF; border:1px solid #F195FF; border-color:#F195FF; border-radius:0px; border-width:1px; color:#000000; display:inline-block; font-size:14px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 40px 12px 40px; text-align:center; text-decoration:none; border-style:solid; font-family:inherit;" target="_blank">Verify Email Now</a>
              </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="7770fdab-634a-4f62-a277-1c66b2646d8d.1">
  <tbody>
    <tr>
      <td style="padding:0px 0px 50px 0px;" role="module-content" bgcolor="#ffffff">
      </td>
    </tr>
  </tbody>
  </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="a265ebb9-ab9c-43e8-9009-54d6151b1600" data-mc-module-version="2019-10-22">
  <tbody>
    <tr>
      <td style="padding:50px 30px 50px 30px; line-height:22px; text-align:inherit; background-color:#6e6e6e;" height="100%" valign="top" bgcolor="#6e6e6e" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="color: #ffffff; font-size: 18px"><strong>NCU Technologies Pvt Limited</strong></span></div>
  <div style="font-family: inherit; text-align: center"><br></div>
  <div style="font-family: inherit; text-align: center"><span style="color: #ffffff; font-size: 18px">Need support? Our support team is always</span></div>
  <div style="font-family: inherit; text-align: center"><span style="color: #ffffff; font-size: 18px">ready to help!&nbsp;</span></div><div></div></div></td>
    </tr>
  </tbody>
  </table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="d050540f-4672-4f31-80d9-b395dc08abe1.1">
    <tbody>
      <tr>
        <td align="center" bgcolor="#6e6e6e" class="outer-td" style="padding:0px 0px 0px 0px;">
          <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
            <tbody>
              <tr>
              <td align="center" bgcolor="#ffbe00" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                <a href="" style="background-color:#F195FF; border:1px solid #F195FF; border-color:#F195FF; border-radius:0px; border-width:1px; color:#000000; display:inline-block; font-size:14px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 40px 12px 40px; text-align:center; text-decoration:none; border-style:solid; font-family:inherit;" target="_blank">Contact Support</a>
              </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="c37cc5b7-79f4-4ac8-b825-9645974c984e">
  <tbody>
    <tr>
      <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="6E6E6E">
      </td>
    </tr>
  </tbody>
  </table></td>
            </tr>
          </tbody>
        </table>
        
      </td>
    </tr>
  </tbody>
  </table><div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe" style="color:#444444; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:Center;" data-muid="4e838cf3-9892-4a6d-94d6-170e474d21e5">
                                          <div class="Unsubscribe--addressLine"><p class="Unsubscribe--senderName" style="font-size:12px; line-height:20px;">Storkes</p><p style="font-size:12px; line-height:20px;"><span class="Unsubscribe--senderAddress">Ncu Technologies</span>, <span class="Unsubscribe--senderCity">Islamabad</span>, <span class="Unsubscribe--senderState">Zone-V</span> <span class="Unsubscribe--senderZip">44000</span></p></div>
                                          <p style="font-size:12px; line-height:20px;"><a class="Unsubscribe--unsubscribeLink" href="{{{unsubscribe}}}" target="_blank" style="">Unsubscribe</a> - <a href="{{{unsubscribe_preferences}}}" target="_blank" class="Unsubscribe--unsubscribePreferences" style="">Unsubscribe Preferences</a></p>
                                        </div><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="550f60a9-c478-496c-b705-077cf7b1ba9a">
    <tbody>
      <tr>
        <td align="center" bgcolor="" class="outer-td" style="padding:0px 0px 20px 0px;">
          <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
            <tbody>
              <tr>
              <td align="center" bgcolor="#f5f8fd" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;"><a href="https://sendgrid.com/" style="background-color:#f5f8fd; border:1px solid #f5f8fd; border-color:#f5f8fd; border-radius:25px; border-width:1px; color:#a8b9d5; display:inline-block; font-size:10px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:5px 18px 5px 18px; text-align:center; text-decoration:none; border-style:solid; font-family:helvetica,sans-serif;" target="_blank">♥ POWERED BY NCU Technologies</a></td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table></td>
                                    </tr>
                                  </tbody></table>
                        </td>
                      </tr>
                    </tbody></table>
                  </td>
                </tr>
              </tbody></table>
            </td>
          </tr>
        </tbody></table>
      </div>
    </center>
  
  
  </body></html>`,
  });
  if (sendemail == 202) {
    return true;
  } else {
    return false;
  }
}

async function verifyEmail(token) {
  try {
    const account = await db.User.findOne({
      where: { verificationToken: token },
    });

    if (!account) throw "Verification failed";

    account.verificationToken = null;
    account.IsVerified = true;
    await account.save();
    console.log(account);
    return true;
  } catch (err) {
    return err;
  }
}

const sendVerificationEmailForgetPassword = async (email) => {
  console.log("email forget password : : : ", email);
  const randomTokenString = async () => {
    return crypto.randomBytes(40).toString("hex");
  };
  const randomToken = await randomTokenString();
  const userExist = await db.User.findOne({ where: { email: email } });

  if (userExist.toString != 0) {
    console.log("one :", randomToken);
    await db.User.update(
      { verificationToken: randomToken },
      { where: { email } }
    );
    let message = `${process.env.SERVER_PATH}/api/user/resetPassword?resetToken=${randomToken}`;
    console.log("one");
    await sendEmail({
      to: email,
      subject: "Forget Password Verfication Mail",
      html: `<h4>Verify Email</h4>
               ${message}`,
    });
    return true;
  } else {
    return false;
  }
};

const sendPasswordEmail = async (email, password) => {
  // let message = `Your password is ${userExist.toString}`;
  console.log("one");
  await sendEmail({
    to: email,
    subject: "Your Password Mail",
    html: `<h4>Here's Your Password: </h4>
               ${password}`,
  });
  return true;
};

const verfiyEmailForgetPassword = async (resetToken) => {
  const checker = await db.User.findOne({ where: { resetToken } });
  if (checker && !checker.verifyEmailForgetPassword) {
    await db.User.update(
      { verifyEmailForgetPassword: true },
      { where: { resetToken } }
    );
    return true;
  } else {
    return false;
  }
};

async function sendInvitationEmail(account, email, url) {
  // console.log("email hit2 ", verifyUrl);
  let sendemail = await sendEmail({
    to: email,
    subject: `${account.username} has invited you to register in DargonHeim Game`,
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"><head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <style type="text/css">
  body, p, div {
    font-family: inherit;
    font-size: 14px;
  }
  body {
    color: #000000;
  }
  body a {
    color: #1188E6;
    text-decoration: none;
  }
  p { margin: 0; padding: 0; }
  table.wrapper {
    width:100% !important;
    table-layout: fixed;
    -webkit-font-smoothing: antialiased;
    -webkit-text-size-adjust: 100%;
    -moz-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }
  img.max-width {
    max-width: 100% !important;
  }
  .column.of-2 {
    width: 50%;
  }
  .column.of-3 {
    width: 33.333%;
  }
  .column.of-4 {
    width: 25%;
  }
  @media screen and (max-width:480px) {
    .preheader .rightColumnContent,
    .footer .rightColumnContent {
      text-align: left !important;
    }
    .preheader .rightColumnContent div,
    .preheader .rightColumnContent span,
    .footer .rightColumnContent div,
    .footer .rightColumnContent span {
      text-align: left !important;
    }
    .preheader .rightColumnContent,
    .preheader .leftColumnContent {
      font-size: 80% !important;
      padding: 5px 0;
    }
    table.wrapper-mobile {
      width: 100% !important;
      table-layout: fixed;
    }
    img.max-width {
      height: auto !important;
      max-width: 100% !important;
    }
    a.bulletproof-button {
      display: block !important;
      width: auto !important;
      font-size: 80%;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
    .columns {
      width: 100% !important;
    }
    .column {
      display: block !important;
      width: 100% !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
  }
  </style>
  <link href="https://fonts.googleapis.com/css?family=Muli&display=swap" rel="stylesheet"><style>
  body {font-family: 'Muli', sans-serif;}
  </style>
  </head>
  <body>
    <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:inherit; color:#000000; background-color:#FFFFFF;">
      <div class="webkit">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF">
          <tbody><tr>
            <td valign="top" bgcolor="#FFFFFF" width="100%">
              <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                <tbody><tr>
                  <td width="100%">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tbody><tr>
                        <td>
  
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                    <tbody><tr>
                                      <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
  <tbody><tr>
    <td role="module-content">
      <p></p>
    </td>
  </tr>
  </tbody></table><table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:30px 20px 30px 20px;" bgcolor="#f6f6f6">
  <tbody>
    <tr role="module-content">
      <td height="100%" valign="top">
        <table class="column" width="540" style="width:540px; border-spacing:0; border-collapse:collapse; margin:0px 10px 0px 10px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="">
          <tbody>
            <tr>
              <td style="padding:0px;margin:0px;border-spacing:0;"><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="72aac1ba-9036-4a77-b9d5-9a60d9b05cba">
  <tbody>
    <tr>
      <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
        <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;" width="29" alt="" data-proportionally-constrained="true" data-responsive="false" src="http://cdn.mcauto-images-production.sendgrid.net/954c252fedab403f/9200c1c9-b1bd-47ed-993c-ee2950a0f239/29x27.png" height="27">
      </td>
    </tr>
  </tbody>
  </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="331cde94-eb45-45dc-8852-b7dbeb9101d7">
  <tbody>
    <tr>
      <td style="padding:0px 0px 20px 0px;" role="module-content" bgcolor="">
      </td>
    </tr>
  </tbody>
  </table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="d8508015-a2cb-488c-9877-d46adf313282">
  <tbody>
    <tr>
      <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
        <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;" width="95" alt="" data-proportionally-constrained="true" data-responsive="false" src="http://cdn.mcauto-images-production.sendgrid.net/954c252fedab403f/61156dfa-7b7f-4020-85f8-a586addf4288/95x33.png" height="33">
      </td>
    </tr>
  </tbody>
  </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="27716fe9-ee64-4a64-94f9-a4f28bc172a0">
  <tbody>
    <tr>
      <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
      </td>
    </tr>
  </tbody>
  </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="948e3f3f-5214-4721-a90e-625a47b1c957" data-mc-module-version="2019-10-22">
  <tbody>
    <tr>
      <td style="padding:50px 30px 18px 30px; line-height:36px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="font-size: 43px">Welcome on Dragon of Midgard Reloaded from ${account.username}!&nbsp;</span></div><div></div></div></td>
    </tr>
  </tbody>
  </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="a10dcb57-ad22-4f4d-b765-1d427dfddb4e" data-mc-module-version="2019-10-22">
  <tbody>
    <tr>
      <td style="padding:18px 30px 18px 30px; line-height:22px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="font-size: 18px">Register your email address to</span><span style="color: #000000; font-size: 18px; font-family: arial,helvetica,sans-serif"> get access to play the game</span><span style="font-size: 18px">.</span></div>
  <div style="font-family: inherit; text-align: center"><span style="color: #F195FF; font-size: 18px"><strong>Thank you!&nbsp;</strong></span></div><div></div></div></td>
    </tr>
  </tbody>
  </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="7770fdab-634a-4f62-a277-1c66b2646d8d">
  <tbody>
    <tr>
      <td style="padding:0px 0px 20px 0px;" role="module-content" bgcolor="#ffffff">
      </td>
    </tr>
  </tbody>
  </table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="d050540f-4672-4f31-80d9-b395dc08abe1">
    <tbody>
      <tr>
        <td align="center" bgcolor="#ffffff" class="outer-td" style="padding:0px 0px 0px 0px;">
          <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
            <tbody>
              <tr>
              <td align="center" bgcolor="#ffbe00" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                <a href=${url} style="background-color:#F195FF; border:1px solid #F195FF; border-color:#F195FF; border-radius:0px; border-width:1px; color:#000000; display:inline-block; font-size:14px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 40px 12px 40px; text-align:center; text-decoration:none; border-style:solid; font-family:inherit;" target="_blank">Register Now</a>
              </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="7770fdab-634a-4f62-a277-1c66b2646d8d.1">
  <tbody>
    <tr>
      <td style="padding:0px 0px 50px 0px;" role="module-content" bgcolor="#ffffff">
      </td>
    </tr>
  </tbody>
  </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="a265ebb9-ab9c-43e8-9009-54d6151b1600" data-mc-module-version="2019-10-22">
  <tbody>
    <tr>
      <td style="padding:50px 30px 50px 30px; line-height:22px; text-align:inherit; background-color:#6e6e6e;" height="100%" valign="top" bgcolor="#6e6e6e" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="color: #ffffff; font-size: 18px"><strong>NCU Technologies Pvt Limited</strong></span></div>
  <div style="font-family: inherit; text-align: center"><br></div>
  <div style="font-family: inherit; text-align: center"><span style="color: #ffffff; font-size: 18px">Need support? Our support team is always</span></div>
  <div style="font-family: inherit; text-align: center"><span style="color: #ffffff; font-size: 18px">ready to help!&nbsp;</span></div><div></div></div></td>
    </tr>
  </tbody>
  </table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="d050540f-4672-4f31-80d9-b395dc08abe1.1">
    <tbody>
      <tr>
        <td align="center" bgcolor="#6e6e6e" class="outer-td" style="padding:0px 0px 0px 0px;">
          <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
            <tbody>
              <tr>
              <td align="center" bgcolor="#ffbe00" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                <a href="" style="background-color:#F195FF; border:1px solid #F195FF; border-color:#F195FF; border-radius:0px; border-width:1px; color:#000000; display:inline-block; font-size:14px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 40px 12px 40px; text-align:center; text-decoration:none; border-style:solid; font-family:inherit;" target="_blank">Contact Support</a>
              </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="c37cc5b7-79f4-4ac8-b825-9645974c984e">
  <tbody>
    <tr>
      <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="6E6E6E">
      </td>
    </tr>
  </tbody>
  </table></td>
            </tr>
          </tbody>
        </table>
        
      </td>
    </tr>
  </tbody>
  </table><div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe" style="color:#444444; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:Center;" data-muid="4e838cf3-9892-4a6d-94d6-170e474d21e5">
                                          <div class="Unsubscribe--addressLine"><p class="Unsubscribe--senderName" style="font-size:12px; line-height:20px;">Storkes</p><p style="font-size:12px; line-height:20px;"><span class="Unsubscribe--senderAddress">Ncu Technologies</span>, <span class="Unsubscribe--senderCity">Islamabad</span>, <span class="Unsubscribe--senderState">Zone-V</span> <span class="Unsubscribe--senderZip">44000</span></p></div>
                                          <p style="font-size:12px; line-height:20px;"><a class="Unsubscribe--unsubscribeLink" href="{{{unsubscribe}}}" target="_blank" style="">Unsubscribe</a> - <a href="{{{unsubscribe_preferences}}}" target="_blank" class="Unsubscribe--unsubscribePreferences" style="">Unsubscribe Preferences</a></p>
                                        </div><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="550f60a9-c478-496c-b705-077cf7b1ba9a">
    <tbody>
      <tr>
        <td align="center" bgcolor="" class="outer-td" style="padding:0px 0px 20px 0px;">
          <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
            <tbody>
              <tr>
              <td align="center" bgcolor="#f5f8fd" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;"><a href="https://sendgrid.com/" style="background-color:#f5f8fd; border:1px solid #f5f8fd; border-color:#f5f8fd; border-radius:25px; border-width:1px; color:#a8b9d5; display:inline-block; font-size:10px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:5px 18px 5px 18px; text-align:center; text-decoration:none; border-style:solid; font-family:helvetica,sans-serif;" target="_blank">♥ POWERED BY NCU Technologies</a></td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table></td>
                                    </tr>
                                  </tbody></table>
                        </td>
                      </tr>
                    </tbody></table>
                  </td>
                </tr>
              </tbody></table>
            </td>
          </tr>
        </tbody></table>
      </div>
    </center>
  
  
  </body></html>`,
  });
  if (sendemail == 202) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  sendVerificationEmail,
  verifyEmail,
  sendVerificationEmailForgetPassword,
  verfiyEmailForgetPassword,
  sendInvitationEmail,
  sendPasswordEmail,
};
