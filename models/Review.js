// models/Review.js

module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    rating: { type: DataTypes.INTEGER, allowNull: false },
    comment: { type: DataTypes.TEXT },
  });

  Review.associate = (models) => {
    Review.belongsTo(models.User, { foreignKey: 'user_id' });
    Review.belongsTo(models.Product, { foreignKey: 'product_id' });
    Review.belongsTo(models.Service, { foreignKey: 'service_id' });
  };

  return Review;
};
