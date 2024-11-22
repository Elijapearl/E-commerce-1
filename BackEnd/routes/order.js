const express = require('express')
const router = express.Router()

const { newOrder, getSingleOrder, myOrders, allOrders, updateOrder, deleteOrder } = require('../controllers/orderControllers')

const { isAuthenticatedUser, 
        authorizedRoles
} = require('../middlewares/auth');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

router.route('/order/new').post(isAuthenticatedUser, newOrder);
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder);
router.route('/orders/me').get(isAuthenticatedUser, myOrders);
router.route('/admin/orders').get(isAuthenticatedUser, allOrders, authorizedRoles('admin'));
router.route('/admin/orders/:id')
        .patch(isAuthenticatedUser, updateOrder, authorizedRoles('admin'))
        .delete(isAuthenticatedUser, deleteOrder, authorizedRoles('admin'))

module.exports = router;




