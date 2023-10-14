// 메인페이지 라우터

const express = require("express");
const router = express.Router();

// 메인
router.get("/home", (req, res) => {
    res.render("./page/main_page/home");
});

// 개인정보처리방침
router.get("/privacy_policy", (req, res) => {
    res.render("./page/main_page/privacy_policy");
});

// 검색
router.get("/search", (req, res) => {
    res.render("./page/main_page/search");
});

// 사이트 소개
router.get("/site_introduction", (req, res) => {
    res.render("./page/main_page/site_introduction");
});

module.exports = router;