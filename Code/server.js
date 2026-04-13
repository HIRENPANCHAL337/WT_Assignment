require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const corsOptions = {
  origin: ['http://127.0.0.1:5500', 'http://127.0.0.1:5500', 'http://localhost', 'http://127.0.0.1'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'authorization']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const authRoutes = require('./routes/auth');
const initiativesRoutes = require('./routes/initiatives');
const eventsRoutes = require('./routes/events');
const contactRoutes = require('./routes/contact');

app.use('/api/auth', authRoutes);
app.use('/api/initiatives', initiativesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/contact', contactRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API Server is running' });
});

const PORT = process.env.SERVER_PORT || 5000;

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
