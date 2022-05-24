const express = require('express');
const app = express();
const pg = require('pg');
const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');

const db = new pg.Pool({
  connectionString: 'postgres://dev:dev@localhost/fungi',
  ssl: {
    rejectUnauthorized: false
  }
});

const jsonMiddleware = express.json();

app.use(jsonMiddleware);

app.get("/api/fungi", (req, res, next) => {
  const sql = `select * from "fungi";`;
  db.query(sql)
    .then(result => {
      const fungi = result.rows;
      res.status(201).json(fungi);
    })
    .catch(err => next(err));
});

app.get("/api/fungi/:fungiId", (req, res, next) => {
  const fungiId = Number(req.params.fungiId);
  if (!fungiId || !Number.isInteger(fungiId)) {
    throw new ClientError(400, 'fungiId must be a positive integer');
  }
  const sql = `select * from "fungi"
              where "fungiId"=$1;`;
  const params = [fungiId];
  db.query(sql, params)
    .then(result => {
      console.log(result);
      if (!result.rows[0]) {
        throw new ClientError(400, `There is no record of fungiId: ${fungiId}`);
      }
      const fungi = result.rows;
      res.status(201).json(fungi);
    })
    .catch(err => next(err));
});


app.post("/api/fungi", (req, res, next) => {
  const { name, family, species, edibility, season, imageUrl } = req.body;
  if (!name || !family || !species || !edibility || !season || !imageUrl) {
    throw new ClientError(400, "name, family, species, edibility, season, and imageUrl are required fields!");
  }
  const sql = `insert into "fungi" ("name", "family", "species", "edibility", "season", "imageUrl")
              values ($1, $2, $3, $4, $5, $6)
              returning *;`;
  const params = [name, family, species, edibility, season, imageUrl];
  db.query(sql, params)
    .then(result => {
      const [newFungi] = result.rows;
      res.status(201).json(newFungi);
    })
    .catch(err => next(err));
})

app.put("/api/fungi/imageUrl/:fungiId", (req, res, next) => {
  const fungiId = Number(req.params.fungiId);
  if (!fungiId || !Number.isInteger(fungiId)) {
    throw new ClientError(400, 'fungiId must be a positive integer');
  }
  const imageUrl = req.body.imageUrl;
  const sql = `update "fungi"
              set "imageUrl" = $1
              where "fungiId" = $2
              returning *;`;
  const params = [imageUrl, fungiId];
  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(400, `There is no record of fungiId: ${fungiId}`);
      }
      const [imageUrlUpdate] = result.rows;
      res.status(200).json(imageUrlUpdate);
    })
    .catch(err => next(err));
})

app.delete("/api/fungi/:fungiId", (req, res, next) => {
  const fungiId = Number(req.params.fungiId);
  if (!fungiId || !Number.isInteger(fungiId)) {
    throw new ClientError(400, 'fungiId must be a positive integer');
  }
  const sql = `delete from "fungi"
              where "fungiId" = $1
              returning *;`;
  const params = [fungiId];
  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(400, `There is no record of fungiId: ${fungiId}`);
      }
      const deletedFungi = result.rows;
      res.sendStatus(204);
    })
    .catch(err => next(err));
})
app.use(errorMiddleware);

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port 3000!');
});
