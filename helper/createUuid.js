const { v4: uuidv4 } = require("uuid");
const format = require("date-fns/format");

module.exports = () => {
  const uuid = uuidv4();
  const nowDate = format(new Date(), "yyyy-MM-dd");
  const token = `${uuid}-${nowDate}`;
  return token;
};
