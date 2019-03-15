/**
 * Select fields builder for list request
 *
 * @param {object} query request query object for select fields
 * @return {object} query with select fields string
 */
exports.selectBuilder = (query) => {
  // check & set select fields with no secret fields
  if (query.select && query.select !== '*') {
    // change the key separator from comma(,) to space( )
    query.select = query.select.split(',').join(' ');
  } else {
    query.select = '';
  }
  return query;
};

/**
 * Filter fields builder for list request
 *
 * @param {object} query request query object for select fields
 * @return {object} query with filter fields object
 */
exports.filterBuilder = (query) => {
  // check or define object for filter
  query.filter = (query.filter) ? query.filter : {};

  return query;
};

/**
 * With ref schema populate fields for list request
 *
 * @param {object} query request query object for select fields
 * @return {object} query with filter fields object
 */
exports.withBuilder = (query) => {
  // define the populates array in with fields
  query.populates = [];

  Object.keys(query.with || {}).forEach((path) => {
    const select = query.with[path].split(',').join(' ');
    query.populates.push({ path, select });
  });
  return query;
};

/**
 * With ref schema deep populate fields for list request
 *
 * @param {object} query request query object for select fields
 * @return {object} query with filter fields object
 */
exports.deepBuilder = (query) => {
  // define the populates array in deep fields
  query.deepPopulates = [];
  Object.keys(query.deep || {}).forEach((path) => {
    const model = Object.keys(query.deep[path]).shift();
    const select = query.deep[path][model].split(',').join(' ');
    query.deepPopulates.push({ path, select, model });
  });
  return query;
};

/**
 * Set skip & limit values for list request
 *
 * @param {object} query request query object to set limit
 * @return {object} return the param query with skip & limit set
 */
exports.limitBuilder = (query) => {
  // check & set the page
  query.skip = (query.skip) ? parseInt(query.skip, 10) : 0;
  // check & set the limit query
  query.limit = (query.limit) ? parseInt(query.limit, 10) : 0;

  return query;
};

/**
 * Set Sort "order" for list request
 *
 * @param {object} query request query object to set sort order
 * @return {Object} return the param query with sort values
 */
exports.sortBuilder = (query) => {
  // check sort set in query
  query.sort = (query.sort) ? query.sort : {};

  return query;
};
