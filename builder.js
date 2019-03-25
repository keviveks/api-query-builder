const builder = (() => {
  /**
   * Prop: default options for request query string will go here
   */
  this.defaults = {};

  /**
   * Select fields builder for list request
   *
   * @param {object} query request query object for select fields
   * @return {object} query with select fields string
   */
  this.select = (query) => {
    // check & set select fields with no secret fields
    if (query.select && query.select !== '*') {
      // change the key separator from comma(,) to space( )
      query.select = (`${query.select} ${this.defaults.select || ''}`).replace(/,/g, ' ').trim();
    } else {
      query.select = (this.defaults.select || '').replace(/,/g, ' ').trim();
    }
    return this;
  };

  /**
   * Filter fields builder for list request
   *
   * @param {object} query request query object for select fields
   * @return {object} query with filter fields object
   */
  this.filter = (query) => {
    // check or define object for filter
    query.filter = Object.assign((this.defaults.filter || {}), (query.filter || {}));

    return this;
  };

  /**
   * With ref schema populate fields for list request
   *
   * @param {object} query request query object for select fields
   * @return {object} query with filter fields object
   */
  this.with = (query) => {
    // define the populates array in with fields
    query.populates = [];

    Object.keys(query.with || {}).forEach((path) => {
      const select = query.with[path].split(',').join(' ');
      query.populates.push({ path, select });
    });
    return this;
  };

  /**
   * With ref schema deep populate fields for list request
   *
   * @param {object} query request query object for select fields
   * @return {object} query with filter fields object
   */
  this.deep = (query) => {
    // define the populates array in deep fields
    query.deepPopulates = [];
    Object.keys(query.deep || {}).forEach((path) => {
      const model = Object.keys(query.deep[path]).shift();
      const select = query.deep[path][model].split(',').join(' ');
      query.deepPopulates.push({ path, select, model });
    });
    return this;
  };

  /**
   * Set skip & limit values for list request
   *
   * @param {object} query request query object to set limit
   * @return {object} return the param query with skip & limit set
   */
  this.limit = (query) => {
    // check & set the page
    query.skip = (query.skip) ? parseInt(query.skip, 10) : this.defaults.skip || 0;
    // check & set the limit query
    query.limit = (query.limit) ? parseInt(query.limit, 10) : this.defaults.limit || 0;

    return this;
  };

  /**
   * Set Sort "order" for list request
   *
   * @param {object} query request query object to set sort order
   * @return {Object} return the param query with sort values
   */
  this.sort = (query) => {
    // check sort set in query
    query.sort = (query.sort) ? query.sort : this.defaults.sort || {};

    return this;
  };

  return this;
})();

module.exports = builder;
