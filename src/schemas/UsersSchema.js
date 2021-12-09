import { getListSkip, getListLimit } from "./SharedSchema";

const getList = {
  type: "object",
  properties: {
    skip: getListSkip,
    limit: getListLimit,
  },
};

module.exports = {
  getList,
};
