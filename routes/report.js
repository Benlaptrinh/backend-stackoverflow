// routes/report.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middlewares/authMiddleware');

// User report nội dung
router.post('/', authMiddleware, reportController.createReport);

// Admin lấy tất cả report
router.get('/', authMiddleware, reportController.getAllReports);

// Admin xử lý report
router.post('/:reportId/resolve', authMiddleware, reportController.resolveReport);

module.exports = router;
