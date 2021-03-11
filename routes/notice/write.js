const joi = require("joi");
const aws = require("aws-sdk");
const axios = require("axios");

const logger = require("../../logger");

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-northeast-2",
});
const csd = new aws.CloudSearchDomain({
  endpoint: process.env.AWS_CSD_DOC,
  apiVersion: "2013-01-01",
});
const params = (id, content, title, nick, createdAt) => {
  return {
    contentType: "application/json",
    documents: JSON.stringify([
      {
        type: "add",
        id,
        fields: {
          content,
          title,
          nick,
          created_at: createdAt,
        },
      },
    ]),
  };
};

const { Notice, sequelize } = require("../../models");

module.exports = async (req, res, next) => {
  const schema = joi.object().keys({
    content: joi.string().required(),
    title: joi.string().max(100).required(),
  });
  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).end();
  }

  const { content, title } = req.body;
  const t = await sequelize.transaction();
  try {
    const notice = await Notice.create(
      {
        adminId: req.user.id,
        content,
        title,
      },
      {
        transaction: t,
      }
    );

    csd.uploadDocuments(
      params(
        notice.id,
        notice.content,
        notice.title,
        notice.nick,
        notice.createdAt
      ),
      async (err, data) => {
        if (err) {
          await t.rollback();

          return next(err);
        } else {
          axios
            .post(
              "https://us-central1-gatmauel-2a4f5.cloudfunctions.net/sendPushData",
              {
                title: notice.title,
                content: notice.content,
              },
              {
                headers: {
                  "Content-type": "application/json",
                },
              }
            )
            .then(async () => {
              await t.commit();

              return res.json(notice);
            })
            .catch(async (err) => {
              if (process.env.NODE_ENV === "production") {
                logger.error(err);
              }

              await t.commit();

              return res.status(202).json(notice);
            });
        }
      }
    );
  } catch (error) {
    await t.rollback();

    return next(error);
  }
};
