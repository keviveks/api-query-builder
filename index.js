const builder = require('./builder');
const utils = require('./utils');

function build() {
  return (req, res, next) => {
    // parse the query object for numbers & boolean values
    req.query = utils.parseQuery(req.query);

    // build the select fields for the request
    req.query = builder.selectBuilder(req.query);

    // build the filter fields for the request
    req.query = builder.filterBuilder(req.query);

    // build the select fields for the request
    req.query = builder.withBuilder(req.query);

    // build the select fields for the request
    req.query = builder.deepBuilder(req.query);

    // build the filter fields for the request
    req.query = builder.limitBuilder(req.query);

    // build the select fields for the request
    req.query = builder.sortBuilder(req.query);

    return next();
  };
}

module.exports.build = build;
