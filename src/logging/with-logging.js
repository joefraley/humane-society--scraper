const log = require("./logger");

module.exports = fn => async (request, res) => {
  try {
    log.info(request);
    const result = await fn(request, res);
    log.info({ result });
    return result;
  } catch (error) {
    log.error(error, "error");
    throw error;
  }
};
