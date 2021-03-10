const admin = require("firebase-admin");
const joi = require("joi");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

module.exports = (req, res, next) => {
  const schema = joi.object().keys({
    endpoint: joi.string().required(),
    keys: joi.object().keys({
      p256dh: joi.string().required(),
      auth: joi.string().required(),
    }),
  });
  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).end();
  }

  admin
    .database()
    .ref("subscription")
    .set(req.body)
    .then(() => {
      return res.end();
    })
    .catch((error) => {
      return next(error);
    });
};
