// Oversize — Node.js + Express backend ishga tushirish punkti

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const db = require('./models'); // Sequelize modeli
const authRouter = require('./routes/auth.routes');
const favoritesRoutes = require('./routes/favorites.routes');
const notificationsRoutes = require('./routes/notifications.routes');

// const userRoutes = require('./routes/users.routes');
// const storeRoutes = require('./routes/stores.routes');
// const productRoutes = require('./routes/products.routes');

const app = express();

// === Middlewares ===
app.use(helmet()); // Xavfsizlik headerlari
app.use(cors());   // CORS o‘rnatish
app.use(express.json()); // JSON parser
app.use(express.urlencoded({ extended: true })); // Form-data parser
app.use(morgan('dev')); // HTTP log

// === API routes ===
app.use('/api/auth', authRouter);
app.use('api/favorites', favoritesRoutes)
app.use('/api/notifications', notificationsRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/stores', storeRoutes);
// app.use('/api/products', productRoutes);

// === Health check ===
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Oversize API is running 🚀' });
});

// === 404 Not Found ===
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// === Global error handler ===
app.use((err, req, res, next) => {
  console.error('🔥 Global error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// === Serverni ishga tushurish ===
const PORT = process.env.PORT || 4000;

db.sequelize.sync({ alter: true }) // Dev uchun schema update
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Oversize API server http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ DB bilan bog‘lanishda xatolik:', error);
  });
