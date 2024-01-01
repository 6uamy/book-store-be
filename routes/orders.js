const express = require('express');
const router = express.Router();

router.use(express.json());

// 결제하기(주문 등록)
router.post('/', (req, res) => {
    res.json('결제하기');
});

// 주문 내역 조회
router.get('/', (req, res) => {
    res.json('주문 내역 조회');
});

// 주문 내역 상품 상세 조회
router.get('/:id', (req, res) => {
    res.json('주문 내역 상품 상세 조회');
});

module.exports = router;
