const aws = require("aws-sdk");
const joi = require("joi");

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-northeast-2",
});
const csd = new aws.CloudSearchDomain({
  endpoint: process.env.AWS_CSD_SEARCH,
  apiVersion: "2013-01-01",
});
const params = (query, page) => {
  return {
    query,
    sort: "created_at desc",
    size: 10,
    start: (page - 1) * 10,
  };
};

const isEnd = (data, page) => {
  if (data.hits.hit.length === 0) {
    return true;
  } else {
    return page === Math.ceil(data.hits.found / 10);
  }
};

module.exports = async (req, res, next) => {
  const schema = joi.object().keys({
    query: joi.string().required(),
    page: joi.number().integer().min(1).required(),
  });
  const result = schema.validate(req.query);
  if (result.error) {
    return res.status(400).end();
  }

  try {
    csd.search(params(req.query.query, req.query.page), (err, data) => {
      if (err) return next(err);
      else {
        return res.json({
          is_end: isEnd(data, parseInt(req.query.page)),
          docs: data.hits.hit.map((value) => ({
            id: value.id,
            title: value.fields.title[0],
            content: value.fields.content[0],
            nick: value.fields.nick[0],
            createdAt: value.fields.created_at[0],
          })),
        });
      }
    });
  } catch (error) {
    return next(error);
  }
};
