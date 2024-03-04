//https://deadsimplechat.com/blog/rest-api-with-postgresql-and-node-js/
//https://expressjs.com/en/resources/middleware/cors.html

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
//app.use(cors());  //Enable All CORS Requests

const whitelist = ['http://localhost:4200']; 

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));

const PORT = process.env.PORT || 8080;

const pool = new Pool({
   user: 'postgres',
   host: 'localhost',
   database: 'project',
   password: 'password',
   port: 5432,
});

app.listen(PORT, () => {
   console.log("Server Listening on PORT:", PORT);
});

app.get('/status', (request, response) => {
   const status = {
      'Status': 'Running'
   };

   response.send(status);
});

async function createAlbumsTable() {
   try {
      const query = `
       CREATE TABLE IF NOT EXISTS albums (
         id SERIAL PRIMARY KEY,
         title VARCHAR(255) NOT NULL,
         artist VARCHAR(255) NOT NULL,
         price NUMERIC(10, 2)
       );
     `;

      await pool.query(query);
      console.log('Albums table created');
   } catch (err) {
      console.error(err);
      console.error('Albums table creation failed');
   }
}

createAlbumsTable();


app.post('/albums', async (req, res) => {

   const { title, artist, price } = req.body;

   console.log(req.body);
   if (!title || !artist || !price) {
      return res.status(400).send('One of the title, or artist, or price is missing in the data');
   }

   try {

      const query = `
       INSERT INTO albums (title, artist, price)
       VALUES ($1, $2, $3)
       RETURNING id;
     `;
      const values = [title, artist, price];

      const result = await pool.query(query, values);
      res.status(201).send({ message: 'New Album created', albumId: result.rows[0].id });
   } catch (err) {
      console.error(err);
      res.status(500).send('some error has occured');
   }
});

app.get('/albums', async (req, res) => {
   try {
      const query = 'SELECT * FROM albums;';
      const { rows } = await pool.query(query);
      res.status(200).json(rows);
   } catch (err) {
      console.error(err);
      res.status(500).send('failed');
   }
});

app.get('/albums/:id', async (req, res) => {
   try {
      const { id } = req.params;
      const query = 'SELECT * FROM albums WHERE id = $1;';
      const { rows } = await pool.query(query, [id]);

      if (rows.length === 0) {
         return res.status(404).send('this album is not in the database');
      }

      res.status(200).json(rows[0]);
   } catch (err) {
      console.error(err);
      res.status(500).send('failed');
   }
});

app.put('/albums/:id', async (req, res) => {
   try {
      const { id } = req.params;
      const { title, artist, price } = req.body;

      if (!title && !artist && !price) {
         return res.status(400).send('provide a field (title, artist, or price)');
      }

      const query = `
       UPDATE albums
       SET title = COALESCE($1, title),
           artist = COALESCE($2, artist),
           price = COALESCE($3, price)
       WHERE id = $4
       RETURNING *;
     `;
      const { rows } = await pool.query(query, [title, artist, price, id]);

      if (rows.length === 0) {
         return res.status(404).send('Cannot find anything');
      }

      res.status(200).json(rows[0]);
   } catch (err) {
      console.error(err);
      res.status(500).send('Some error has occured failed');
   }
});

app.delete('/albums/:id', async (req, res) => {
   try {
      const { id } = req.params;
      const query = 'DELETE FROM albums WHERE id = $1 RETURNING *;';
      const { rows } = await pool.query(query, [id]);

      if (rows.length === 0) {
         return res.status(404).send('we have not found the album');
      }

      res.status(200).json(rows[0]);
   } catch (err) {
      console.error(err);
      res.status(500).send('some error has occured');
   }
});



