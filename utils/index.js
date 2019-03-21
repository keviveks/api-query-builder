const parser = require('./parser');
const validator = require('./validator');

/**
 * Parse the request query object for numbers & boolean values
 * @param {Object} query request query object
 */
exports.parseQuery = query => parser.parseObject(query);

/**
 * Validate the query object with fields
 */
exports.validator = query => validator.validate(query);
