const { expect } = require('chai');
const sinon = require('sinon');
const httpMocks = require('node-mocks-http');

const apiQueryBuilder = require('./index');

describe('api-query-builder', () => {
  describe('middleware function', () => {
    let middleware;

    beforeEach(() => {
      middleware = apiQueryBuilder.build();
    });

    it('should return a function', () => {
      expect(middleware).to.be.a('function');
    });

    it('should accept 3 arguments', () => {
      expect(middleware.length).to.equal(3);
    });
  });

  describe('builder to next', () => {
    it('should call next() once', () => {
      const middleware = apiQueryBuilder.build();
      const nextSpy = sinon.spy();
      middleware({}, {}, nextSpy);
      // eslint-disable-next-line no-unused-expressions
      expect(nextSpy.calledOnce).to.be.true;
    });
  });

  describe('build query string', () => {
    let middleware;
    let req;
    let res;

    beforeEach(() => {
      middleware = apiQueryBuilder.build();
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();
    });

    it('should build the query string with all property', () => {
      middleware(req, res, () => {
        expect(req).to.have.property('query');
        expect(req.query).to.have.property('select');
        expect(req.query).to.have.property('filter');
        expect(req.query).to.have.property('populates');
        expect(req.query).to.have.property('deepPopulates');
        expect(req.query).to.have.property('sort');
        expect(req.query).to.have.property('limit');
        expect(req.query).to.have.property('skip');
      });
    });

    it('should build the query string in proper format', () => {
      middleware(req, res, () => {
        expect(req.query.select).to.be.a('string');
        expect(req.query.select).to.have.string('');
        expect(req.query.filter).to.be.a('object');
        expect(req.query.filter).to.deep.equal({});
        expect(req.query.populates).to.be.an('array');
        expect(req.query.populates).to.deep.equal([]);
        expect(req.query.deepPopulates).to.be.an('array');
        expect(req.query.deepPopulates).to.deep.equal([]);
        expect(req.query.sort).to.be.a('object');
        expect(req.query.sort).to.deep.equal({});
        expect(req.query.limit).to.be.a('number');
        expect(req.query.limit).to.equal(0);
        expect(req.query.skip).to.be.a('number');
        expect(req.query.skip).to.equal(0);
      });
    });

    it('should build the query string with valid values', () => {
      // adding invalid query string to req
      req.query = {
        select: 'name, email, test',
        filter: {
          active: 'true',
          name: ' test ',
          number: '5',
        },
        with: {
          user: 'name, email',
        },
        deep: {
          child: {
            user: 'name, phone',
          },
        },
        sort: {
          created: 'asc',
        },
        limit: '3',
        skip: '5',
      };
      middleware(req, res, () => {
        expect(req.query.select).to.be.a('string');
        expect(req.query.select).to.have.string('name email test');
        expect(req.query.filter).to.be.a('object');
        expect(req.query.filter).to.deep.equal({ active: true, name: 'test', number: 5 });
        expect(req.query.populates).to.be.an('array');
        expect(req.query.populates).to.deep.include({ path: 'user', select: 'name email' });
        expect(req.query.deepPopulates).to.be.an('array');
        expect(req.query.deepPopulates).to.deep.include({ path: 'child', select: 'name phone', model: 'user' });
        expect(req.query.sort).to.be.a('object');
        expect(req.query.sort).to.deep.equal({ created: 'asc' });
        expect(req.query.limit).to.be.a('number');
        expect(req.query.limit).to.equal(3);
        expect(req.query.skip).to.be.a('number');
        expect(req.query.skip).to.equal(5);
      });
    });
  });

  describe('build query string with default options', () => {
    let middleware;
    let req;
    let res;
    const defaultOptions = {
      select: 'default',
      filter: {
        default: 'true',
      },
      sort: {
        default: 'asc',
      },
      limit: '1',
      skip: '2',
    };

    beforeEach(() => {
      middleware = apiQueryBuilder.build(defaultOptions);
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();
    });

    it('should build the query string with default values', () => {
      middleware(req, res, () => {
        expect(req.query.select).to.be.a('string');
        expect(req.query.select).to.have.string('default');
        expect(req.query.filter).to.be.a('object');
        expect(req.query.filter).to.deep.equal({ default: true });
        expect(req.query.populates).to.be.an('array');
        expect(req.query.populates).to.deep.equal([]);
        expect(req.query.deepPopulates).to.be.an('array');
        expect(req.query.deepPopulates).to.deep.equal([]);
        expect(req.query.sort).to.be.a('object');
        expect(req.query.sort).to.deep.equal({ default: 'asc' });
        expect(req.query.limit).to.be.a('number');
        expect(req.query.limit).to.equal(1);
        expect(req.query.skip).to.be.a('number');
        expect(req.query.skip).to.equal(2);
      });
    });

    it('should build the query string with default & query values', () => {
      // adding invalid query string to req
      req.query = {
        select: 'name, email, test',
        filter: {
          active: 'true',
          name: ' test ',
          number: '5',
        },
        with: {
          user: 'name, email',
        },
        deep: {
          child: {
            user: 'name, phone',
          },
        },
        sort: {
          created: 'asc',
        },
        limit: '3',
        skip: '5',
      };
      middleware(req, res, () => {
        expect(req.query.select).to.be.a('string');
        expect(req.query.select).to.have.string('name email test default');
        expect(req.query.filter).to.be.a('object');
        expect(req.query.filter).to.deep.equal({
          active: true, name: 'test', number: 5, default: true,
        });
        expect(req.query.populates).to.be.an('array');
        expect(req.query.populates).to.deep.include({ path: 'user', select: 'name email' });
        expect(req.query.deepPopulates).to.be.an('array');
        expect(req.query.deepPopulates).to.deep.include({ path: 'child', select: 'name phone', model: 'user' });
        expect(req.query.sort).to.be.a('object');
        expect(req.query.sort).to.deep.equal({ created: 'asc' });
        expect(req.query.limit).to.be.a('number');
        expect(req.query.limit).to.equal(3);
        expect(req.query.skip).to.be.a('number');
        expect(req.query.skip).to.equal(5);
      });
    });
  });

  describe('build query string with default options & dontUseDefault query', () => {
    let middleware;
    let req;
    let res;
    const defaultOptions = {
      select: 'default',
      filter: {
        default: 'true',
      },
      sort: {
        default: 'asc',
      },
      limit: '1',
      skip: '2',
    };

    beforeEach(() => {
      middleware = apiQueryBuilder.build(defaultOptions);
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();
    });

    it('should build the query string with default & dontUseDefault query', () => {
      // adding invalid query string to req
      req.query = {
        dontUseDefault: 'true',
        select: 'name, email, test',
        filter: {
          active: 'true',
          name: ' test ',
          number: '5',
        },
        with: {
          user: 'name, email',
        },
        deep: {
          child: {
            user: 'name, phone',
          },
        },
        sort: {
          created: 'asc',
        },
        limit: '3',
        skip: '5',
      };
      middleware(req, res, () => {
        expect(req.query.select).to.be.a('string');
        expect(req.query.select).to.have.string('name email test');
        expect(req.query.filter).to.be.a('object');
        expect(req.query.filter).to.deep.equal({ active: true, name: 'test', number: 5 });
        expect(req.query.populates).to.be.an('array');
        expect(req.query.populates).to.deep.include({ path: 'user', select: 'name email' });
        expect(req.query.deepPopulates).to.be.an('array');
        expect(req.query.deepPopulates).to.deep.include({ path: 'child', select: 'name phone', model: 'user' });
        expect(req.query.sort).to.be.a('object');
        expect(req.query.sort).to.deep.equal({ created: 'asc' });
        expect(req.query.limit).to.be.a('number');
        expect(req.query.limit).to.equal(3);
        expect(req.query.skip).to.be.a('number');
        expect(req.query.skip).to.equal(5);
      });
    });
  });
});
