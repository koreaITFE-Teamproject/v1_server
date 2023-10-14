// 고객센터 라우터

const express = require("express");
const router = express.Router();

// 챗봇
router.get("/chatbot", (req, res) => {
    res.render("./page/customer_center/chatbot");
});

// 1:1 고객센터
router.get("/center", (req, res) => {
    res.render("./page/customer_center/customer_center");
});



module.exports = router;