const parser = require('./parser');

/**
 * Parse the request query object for numbers & boolean values
 * @param {Object} query request query object
 */
exports.parseQuery = query => parser.parseObject(query);
