const express = require('express');
const cors = require('cors');

const statsRoutes = require('./routes/statsRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

app.use(cors());
app.use(express.json());

const mapRoutes = require('./api/routes/mapRoutes');

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Backend está funcionando!' });
});

app.use('/api/v1/map', mapRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/report', reportRoutes);

app.get('/', (req, res) => {
    res.send('API OncoMap Online 🚀');
});

module.exports = app;