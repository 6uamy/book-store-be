const express = require('express');
const router = express.Router();
const {addLikes, removeLikes} = require('../controllers/LikesController');
router.use(express.json());

// 좋아요 추가
router.post('/:liked_book_id', addLikes);

// 좋아요 취소
router.delete('/:liked_book_id', removeLikes);

module.exports = router;
