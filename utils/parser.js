/* eslint-disable no-restricted-globals */
/* eslint-disable no-plusplus */
const parser = (() => {
  /**
   * Find the value is boolean
   * @param {Any} val boolean string
   * @return {Boolean} boolean value
   */
  this.isBoolean = val => (val === 'false' || val === 'true');

  /**
   * Find the value is number
   * @param {Any} val number string
   * @return {Boolean} boolean value
   */
  this.isNumber = val => (!isNaN(parseFloat(val)) && isFinite(val));

  /**
   * Find the value is array
   * @param {Array} arr array
   * @return {Boolean} boolean value
   */
  this.isArray = val => (Array.isArray(val));

  /**
   * Find the value is object
   * @param {Any} val object value
   * @return {Boolean} boolean value
   */
  this.isObject = val => (val.constructor === Object);

  /**
   * Parse boolean string to boolean value
   * @param {Any} val boolean string
   * @return {Boolean}
   */
  this.parseBoolean = val => (val === 'true');

  /**
   * Parse number string to number
   * @param {Any} val number string
   * @return {Number}
   */
  this.parseNumber = val => Number(val);

  /**
   * Parse array values
   * @param {Array} arr array value
   * @return {Array}
   */
  this.parseArray = (arr) => {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      result[i] = this.parseValue(arr[i]);
    }
    return result;
  };

  /**
   * Parse string values & replce the empty spaces
   * @param {String} val String value
   * @return {String}
   */
  this.parseString = val => val.replace(/ /g, '').toString();

  /**
   * Parse value
   * @param {Any} val
   * @return {Any}
   */
  this.parseValue = (val) => {
    if (typeof val === 'undefined' || val === '') {
      val = null;
    } else if (this.isBoolean(val)) {
      val = this.parseBoolean(val);
    } else if (this.isArray(val)) {
      val = this.parseArray(val);
    } else if (this.isObject(val)) {
      val = this.parseObject(val);
    } else if (this.isNumber(val)) {
      val = this.parseNumber(val);
    } else {
      val = this.parseString(val);
    }

    return val;
  };

  /**
   * Parse object
   * @param {Object} val
   * @return {Object}
   */
  this.parseObject = (obj) => {
    const result = {};
    let val;

    Object.keys(obj || {}).forEach((key) => {
      val = this.parseValue(obj[key]);
      if (val !== null) result[key] = val; // ignore null values
    });

    return result;
  };

  return this;
})();

module.exports.parser = parser;
/* eslint-enable no-restricted-globals */
/* eslint-enable no-plusplus */
