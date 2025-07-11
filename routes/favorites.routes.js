const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favorites.controller');
const authMiddleware = require('../middlewares/auth.middleware'); // JWT auth bo‘lsa

router.use(authMiddleware); // Barcha route auth bilan

// === Product Favorites ===
router.post('/products/add', favoritesController.addProductFavorite);
router.post('/products/remove', favoritesController.removeProductFavorite);
router.get('/products', favoritesController.getProductFavorites);

// === Service Favorites ===
router.post('/services/add', favoritesController.addServiceFavorite);
router.post('/services/remove', favoritesController.removeServiceFavorite);
router.get('/services', favoritesController.getServiceFavorites);

module.exports = router;
