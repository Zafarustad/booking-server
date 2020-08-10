require('dotenv').config();
const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

var db;
var collection;

//API's
app.get('/booking', (req, res) => {
  collection
    .find({})
    .toArray()
    .then((results) => {
      return res.status(200).json(results);
    })
    .catch((err) => {
      return res.status(400).json({ error: `Internal server error: ${err}` });
    });
});

app.post('/booking', (req, res) => {
  const { email, bookingDate, firstname } = req.body;
  if ((!email || !bookingDate, !firstname)) {
    return res.status(400).json({ error: 'Feilds must not be empty' });
  }
  const data = { email, bookingDate, firstname };
  collection
    .insertOne(data)
    .then((result) => {
      return res.status(200).json({ message: 'Slot booked successfully' });
    })
    .catch((err) => {
      return res
        .status(400)
        .json({ error: 'This date slot is already booked' });
    });
});

app.listen(PORT, () => {
  MongoClient.connect(
    process.env.ATLAS_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (error, client) => {
      if (error) throw error;
      db = client.db(config.dbName);
      collection = db.collection(config.dbCollection);
      `Connected to ${config.dbName} on ${PORT}`;
    }
  );
});
