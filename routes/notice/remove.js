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
const params = (id) => {
  return {
    contentType: "application/json",
    documents: JSON.stringify([
      {
        type: "delete",
        id,
      },
    ]),
  };
};

const { Notice, sequelize } = require("../../models");

module.exports = async (req, res, next) => {
  const { id } = req.params;
  const t = await sequelize.transaction();
  try {
    await Notice.destroy({ where: { id }, transaction: t });

    csd.uploadDocuments(params(id), async (err, data) => {
      if (err) {
        await t.rollback();

        return next(err);
      } else {
        await t.commit();

        return res.status(204).end();
      }
    });
  } catch (error) {
    await t.rollback();

    return next(error);
  }
};
