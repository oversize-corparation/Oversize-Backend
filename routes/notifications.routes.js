const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notifications.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

// Barchasi
router.get('/', notificationsController.getNotifications);
router.patch('/mark/:id', notificationsController.markAsRead);
router.patch('/mark-all', notificationsController.markAllAsRead);

module.exports = router;
