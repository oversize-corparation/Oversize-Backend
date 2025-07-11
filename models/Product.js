// models/Product.js

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.FLOAT, allowNull: false },
    category: { type: DataTypes.STRING },
    size: { type: DataTypes.STRING },
    color: { type: DataTypes.STRING },
    stock_quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
    image_url: { type: DataTypes.STRING },
    discount_percentage: { type: DataTypes.FLOAT, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Store, { foreignKey: 'store_id' });
    Product.hasMany(models.OrderItem, { foreignKey: 'product_id' });
    Product.hasMany(models.Review, { foreignKey: 'product_id' });
    Product.hasMany(models.FavoritesProduct, { foreignKey: 'product_id' });
  };

  return Product;
};
