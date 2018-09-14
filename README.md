# api-query-builder
RestAPI Query Builder to build mongoose model query from api query string.

This package will helps you to build a stright forward query object for mongoose query with all possible properties from API url query string i.e.

| Query String  | Description |
|-------------|--------------|
| select  | Select fields from mongoose model  |
| filter | Model where query filter |
| with | With populate the reference object |
| deep | Deep populate the reference of inheritance object  |
| offset | Data offset value |
| limit | Data limit |
| sort | Sort order field name |
| order | Sort by asc, desc value |

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
const builder = require('api-query-builder');

const app = express();

app.use(builder.build());

app.get('/', function(req, res) {
  res.json(res.query);
});
```

## Sample

##### 1. API url with query string

```js
GET: api/users?select=firstName,email,_role&filter[active]=true&filter[createdAt][$gt]=2018-09-09&with[_role]=name,_department_&deep[_role._department]=name&offset=0&limit=10&sort=createdAt&order=desc
```

##### 2. Mongoose model with api response

```js
  api.get('/user', async function(req, res) {
    const { query } = req;
    // query mongoose user model
    const users = await User.find(query.filter)
      .select(query.select)
      .skip(query.offset)
      .limit(query.limit)
      .sort(query.sortBy)
      .exec();

    // populate ref schema fields
    if (query.populates.length && users.length) {
      await Promise.all(Object.values(query.populates)
        .map(({ path, select }) => User.populate(users, { path, select })));
    }

    // check for deep populate
    if (query.deepPopulates.length) {
      await Promise.all(Object.values(query.deepPopulates)
        .map(({ path, select, model }) => User.populate(users, { path, select, model })));
    }

    return res.json(users);
  });
```

##### 4. Sample JSON response

```json
[
  {
    "firstName": "Shelton",
    "email": "shelton@bbt.com",
    "_role": {
      "name": "Scientist",
      "_department": {
        "name": "Physics"
      }
    }
  }
]
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

This project is licensed under the GPL License - see the LICENSE.md file for details

## Acknowledgement

## Todo

- [ ] Unit Test
