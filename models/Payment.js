// models/Payment.js

module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    amount: { type: DataTypes.FLOAT, allowNull: false },
    payment_method: {
      type: DataTypes.ENUM('Stripe', 'PayPal', 'Uzcard', 'Payme', 'Click'),
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending',
    },
    transaction_id: { type: DataTypes.STRING },
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Order, { foreignKey: 'order_id' });
  };

  return Payment;
};
