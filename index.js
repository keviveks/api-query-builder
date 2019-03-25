const builder = require('./builder');
const utils = require('./utils');

function build(options = {}) {
  return (req, res, next) => {
    try {
      // parse & validate the query object for numbers & boolean values
      req.query = utils.parseQuery(req.query);
      req.query = utils.validator(req.query);

      // parse & validate the default options
      options = utils.parseQuery(options);
      options = utils.validator(options);

      // check use default flag in the query to use default options for the builder
      builder.defaults = req.query.dontUseDefault ? {} : options;

      // build the select fields for the request
      builder.select(req.query)
        // build the filter fields for the request
        .filter(req.query)

        // build the select fields for the request
        .with(req.query)

        // build the select fields for the request
        .deep(req.query)

        // build the filter fields for the request
        .limit(req.query)

        // build the select fields for the request
        .sort(req.query);

      return next();
    } catch (error) {
      return next(error);
    }
  };
}

module.exports.build = build;
