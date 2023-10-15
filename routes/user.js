// 유저페이지 라우터

const express = require("express");
const router = express.Router();

// 회원가입
router.get("/join", (req, res) => {
    res.render("./user/join");
});

// 로그인
router.get("/login", (req, res) => {
    res.render("./user/login");
});

// 수정
router.get("/modify", (req, res) => {
    res.render("./user/modify");
});

// 비밀번호 변경
router.get("/passwd_reset", (req, res) => {
    res.render("./user/passwd/passwd_reset");
});

// 비밀번호 찾기
router.get("/passwd_find", (req, res) => {
    res.render("./user/passwd/passwd");
});

// 회원 탈퇴
router.get("/delete_account", (req, res) => {
    res.render("./user/delete_account");
});

// 아이디 찾기1
router.get("/findById1", (req, res) => {
    res.render("./user/id/userFindById1");
});

// 아이디 찾기2
router.get("/findById2", (req, res) => {
    res.render("./user/id/userFindById2");
});


// 컬럼
// 전체 컬럼
router.get("/all_column", (req, res) => {
    res.render("./user/column/maincolumn/allColumn");
});

// 구독 컬럼
router.get("/sub_column", (req, res) => {
    res.render("./user/column/maincolumn/subColumn");
});

// 좋아요 컬럼
router.get("/like_column", (req, res) => {
    res.render("./user/column/maincolumn/likeColumn");
});

// 컬럼 작성
router.get("/write_column", (req, res) => {
    res.render("./user/column/writeColumn/writeColumn");
});

// 컬럼 읽기
router.get("/read_column", (req, res) => {
    res.render("./user/column/maincolumn/read_column_comment");
});

module.exports = router;