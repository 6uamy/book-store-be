const express = require('express');
const {order, getOrders, getOrderDetail} = require('../controllers/OrdersController');
const router = express.Router();

router.use(express.json());

// 결제하기(주문 등록)
router.post('/', order);

// 주문 내역 조회
router.get('/', getOrders);

// 주문 내역 상품 상세 조회
router.get('/:id', getOrderDetail);

module.exports = router;
