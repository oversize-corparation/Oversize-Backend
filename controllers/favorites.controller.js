const db = require('../models');
const FavoritesProduct = db.FavoritesProduct;
const FavoritesService = db.FavoritesService;

// === Product Favorite ===

// Qo‘shish
exports.addProductFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;

    const favorite = await FavoritesProduct.create({
      user_id: userId,
      product_id,
    });

    res.status(201).json({ message: 'Product favorited', favorite });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// O‘chirish
exports.removeProductFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;

    await FavoritesProduct.destroy({
      where: {
        user_id: userId,
        product_id,
      },
    });

    res.status(200).json({ message: 'Product favorite removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Ro‘yxat
exports.getProductFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await FavoritesProduct.findAll({
      where: { user_id: userId },
      include: ['Product'], // Eslatma: associate da alias bo‘lishi kerak
    });

    res.status(200).json(favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// === Service Favorite ===

exports.addServiceFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { service_id } = req.body;

    const favorite = await FavoritesService.create({
      user_id: userId,
      service_id,
    });

    res.status(201).json({ message: 'Service favorited', favorite });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeServiceFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { service_id } = req.body;

    await FavoritesService.destroy({
      where: {
        user_id: userId,
        service_id,
      },
    });

    res.status(200).json({ message: 'Service favorite removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getServiceFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await FavoritesService.findAll({
      where: { user_id: userId },
      include: ['Service'], // Eslatma: associate da alias bo‘lishi kerak
    });

    res.status(200).json(favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
