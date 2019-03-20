# api-query-builder
RestAPI Query Builder to build mongoose model query from api query string.

This package will helps you to build a stright forward query object for mongoose query with all possible properties from API url query string i.e.

| Query String  | Description |
|-------------|--------------|
| select  | Select fields from mongoose model  |
| filter | Model find query filter |
| with | With populate the reference object |
| deep | Deep populate the reference of inheritance object  |
| skip | Data skip value |
| limit | Data limit |
| sort | Sort order field name by asc desc value |

> Note: All these fields are optional in the url, by default our package will build an sample query object.

## Setup

Using `yarn`:

```shell
yarn add api-query-builder
```

or by using `npm`:

```shell
npm install --save api-query-builder
```

## Usage

```js
const express = require('express');
const apiQueryBuilder = require('api-query-builder');

const app = express();

app.use(apiQueryBuilder.build());

app.get('/', function(req, res) {
  res.json(res.query);
});
```

You can pass an default options also in the build middleware which will apply for all the request
## Usage

```js

app.use(apiQueryBuilder.build({
  select: 'createdBy,createdAt,isActive',
  filter: {
    active: true,
    deleted: false,
  },
  sort: {
    createdAt: "asc",
  },
}));

```

## Sample

#### 1. API url with query string

```js
GET: api/users?select=firstName,email,_role&filter[active]=true&filter[createdAt][$gt]=2018-09-09&with[_role]=name,_department_&deep[_role._department]=name&skip=0&limit=10&sort[createdAt]=desc
```

#### 2. Mongoose model with api response

```js
  api.get('/user', async function(req, res) {
    const { filter, select, skip, limit, sort, populates, deepPopulates } = req.query;
    // query mongoose user model
    const users = await User.find(filter)
      .select(select)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .exec();

    // populate ref schema fields
    if (populates.length && users.length) {
      await Promise.all(Object.values(populates)
        .map(({ path, select }) => User.populate(users, { path, select })));
    }

    // check for deep populate
    if (deepPopulates.length) {
      await Promise.all(Object.values(deepPopulates)
        .map(({ path, select, model }) => User.populate(users, { path, select, model })));
    }

    return res.json(users);
  });
```

#### 4. Sample JSON response

```json
[
  {
    "firstName": "Shelton",
    "email": "shelton@bbt.com",
    "_role": {
      "name": "Scientist", // the populated object for user
      "_department": {
        "name": "Physics" // the deep populated object from role of user
      }
    }
  }
]
```

#### 5. Call API with with no default values

  For a specific API if dont want to set defualt values pass "dontUseDefault" param with "true" value in query string. This will never append the default values for that API.

```js
GET: api/users?select=firstName,email,_role&filter[active]=true&dontUseDefault=true
```

## Test

```shell
yarn test
```

## Contribution

We welcome any contribution you make, please refer [contributors guidelines](https://help.github.com/articles/setting-guidelines-for-repository-contributors/) to start contribute to this package, Thanks.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [versions](https://github.com/keviveks/api-query-builder/releases) on this repository.

## Authors

- [keviveks](https://github.com/keviveks)

## License

This project is licensed under the GPL License - see our LICENSE file for details

## Acknowledgement

## Todo

- [ ] Unit Test
