// models/FavoritesProduct.js

module.exports = (sequelize, DataTypes) => {
  const FavoritesProduct = sequelize.define('FavoritesProduct', {});

  FavoritesProduct.associate = (models) => {
    FavoritesProduct.belongsTo(models.User, { foreignKey: 'user_id' });
    FavoritesProduct.belongsTo(models.Product, { foreignKey: 'product_id' });
  };

  return FavoritesProduct;
};
