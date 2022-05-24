const express = require('express');
const app = express();
const pg = require('pg');

const db = new pg.Pool({
  connectionString: 'postgres://dev:dev@localhost/fungi',
  ssl: {
    rejectUnauthorized: false
  }
});

const jsonMiddleware = express.json();

app.use(jsonMiddleware);

app.get("/api/fungi", (req, res, next) => {
  const sql = `select * from "fungi"`;
  db.query(sql)
    .then(result => {
      const fungi = result.rows;
      res.status(201).json(fungi);
    })
    .catch(err => next(err));
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port 3000!');
});
