const joi = require("joi");
const aws = require("aws-sdk");

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-northeast-2",
});
const csd = new aws.CloudSearchDomain({
  endpoint: process.env.AWS_CSD_DOC,
  apiVersion: "2013-01-01",
});
const params = (id, content, title) => {
  return {
    contentType: "application/json",
    documents: JSON.stringify([
      {
        type: "add",
        id,
        fields: {
          content,
          title,
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

  const { id } = req.params;
  const t = await sequelize.transaction();
  try {
    await Notice.update(
      {
        content: req.body.content,
        title: req.body.title,
      },
      { where: { id }, transaction: t }
    );

    csd.uploadDocuments(
      params(id, req.body.content, req.body.title),
      async (err, data) => {
        if (err) {
          await t.rollback();

          return next(err);
        } else {
          await t.commit();

          return res.end();
        }
      }
    );
  } catch (error) {
    await t.rollback();

    return next(error);
  }
};
