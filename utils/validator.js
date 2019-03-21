/**
 * Validator to valide query params
 *
 * @returns
 */
const validator = (() => {
  this.rules = {
    select: {
      type: 'string',
      noSpace: true,
      required: false,
    },
    filter: {
      type: 'object',
      required: false,
    },
    with: {
      type: 'object',
      required: false,
    },
    deep: {
      type: 'object',
      required: false,
    },
    skip: {
      type: 'number',
      required: false,
    },
    limit: {
      type: 'number',
      required: false,
    },
    sort: {
      type: 'object',
      required: false,
    },
  };

  this.validate = (obj) => {
    Object.keys(obj || {}).forEach((key) => {
      // check & validate with the validator rules object
      if (Object.prototype.hasOwnProperty.call(this.rules, key)) {
        // eslint-disable-next-line valid-typeof
        if (typeof obj[key] !== this.rules[key].type) {
          console.warn(`API-QUERY-BUILDER: ${key} should be in ${this.rules[key].type} format!`);
        }
        if (this.rules[key].required && !obj[key]) {
          console.error(`API-QUERY-BUILDER: ${key} cannot be empty!`);
        }
      }
    });
    return obj;
  };

  return this;
})();

module.exports.validator = validator;
