const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use(bodyParser.json());
const DATA_FILE = 'mobile_alerts.json';

app.post('/submit-alert', (req, res) => {
  const { lat, lon, timestamp, userId } = req.body;
  const record = { lat, lon, timestamp, userId };
  let arr = [];
  if (fs.existsSync(DATA_FILE)) {
    arr = JSON.parse(fs.readFileSync(DATA_FILE));
  }
  arr.push(record);
  fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2));
  res.json({ status: 'ok' });
});

app.get('/alerts-nearby', (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);
  const radius = parseFloat(req.query.radius) || 1000;
  let arr = [];
  if (fs.existsSync(DATA_FILE)) {
    arr = JSON.parse(fs.readFileSync(DATA_FILE));
  }
  const nearby = arr.filter(a => {
    const dLat = (a.lat - lat) * 111000;
    const dLon = (a.lon - lon) * 111000 * Math.cos(lat * Math.PI/180);
    return Math.sqrt(dLat*dLat + dLon*dLon) <= radius;
  });
  res.json({ results: nearby });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
