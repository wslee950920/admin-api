const joi = require("joi");
const aws = require("aws-sdk");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: "ap-northeast-2",
});

const transporter = nodemailer.createTransport({
  SES: new aws.SES({
    apiVersion: "2010-12-01",
  }),
});

const { Admin } = require("../../models");

const Register = async (req, res, next) => {
  const schema = joi.object().keys({
    email: joi.string().max(40).required(),
    nick: joi.string().max(20),
    password: joi.string().max(100).required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).end();
  }

  const { email, nick, password } = req.body;
  try {
    const exAdmin = await Admin.findByEmail(email);
    if (exAdmin) {
      return res.status(409).end();
    }

    const newAdmin = Admin.build({
      email,
      nick,
    });
    await newAdmin.setPassword(password);
    await newAdmin.save();

    const token = jwt.sign(
      {
        id: newAdmin.id,
        email: newAdmin.email,
      },
      process.env.AUTH_SECRET,
      {
        expiresIn: "3d",
      }
    );
    // send some mail
    transporter.sendMail(
      {
        from: "gatmauel9300@gmail.com",
        to: "gatmauel9300@gmail.com",
        subject: "갯마을 관리자 이메일 인증",
        html: `<p>갯마을 관리자 이메일(${newAdmin.email})을 인증하시겠습니까? 아래 링크를 클릭해주세요.</p>
              <a href="http://localhost:9091/api/auth/callback?token=${token}" target="_blank">http://localhost:9091/api/auth/callback?token=${token}</a>
              <p>위 링크는 3일간 유효합니다.</p>`,
      },
      (err, info) => {
        if (err) {
          console.error(err);
        }
        if (info) {
          console.log(info);
        }
      }
    );

    return res.json(newAdmin.serialize());
  } catch (error) {
    console.error(error);

    return next(error);
  }
};

module.exports = Register;
