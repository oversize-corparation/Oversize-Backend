// models/Order.js

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending',
    },
    total_price: { type: DataTypes.FLOAT, allowNull: false },
    shipping_address: { type: DataTypes.STRING },
    payment_status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending',
    },
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: 'user_id' });
    Order.belongsTo(models.Store, { foreignKey: 'store_id' });
    Order.hasMany(models.OrderItem, { foreignKey: 'order_id' });
    Order.hasMany(models.OrderService, { foreignKey: 'order_id' });
    Order.hasMany(models.Payment, { foreignKey: 'order_id' });
  };

  return Order;
};
