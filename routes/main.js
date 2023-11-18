// 메인페이지 라우터

const express = require("express");
const commonFunc = require("../common");
const connection = require("../server.js"); // mysql 사용하기 위해 require
const router = express.Router();

// 메인
router.get("/home", (req, res) => {
    userInfo = commonFunc.checkLoginStatus(req);    // 리턴값 받음
    userInfo === false ? userInfo = { isLogined: false, nickname: "" } : userInfo;
    res.render("./main_page/home", userInfo);
});

// 메인페이지 칼럼 가져오기
router.get("/fetchColum", (req, res) => {
    const query = `
        SELECT
        colmn_uniqu_id as ROW_NUM,
        sj,
        colmn_img_path as cip,
        (SELECT NCNM FROM USER_INFO WHERE USER_ID = COLMN_WRTER ) AS COLMN_WRTER
        from BK_COLUMN as BC
        ORDER BY COLMN_UNIQU_ID DESC
        limit 10
    `;

    connection.query(query, (queryErr, results) => {
        if (queryErr) {
            console.error("Error executing query:", queryErr);
            res.status(500).send("Internal Server Error");
            return;
        }

        // console.log(results);

        res.json({ column: results });
    });
});

// 개인정보처리방침
router.get("/privacy_policy", (req, res) => {
    res.render("./main_page/privacy_policy");
});

// 검색
router.get("/search", (req, res) => {
    res.render("./main_page/search");
});

// 사이트 소개
router.get("/site_introduction", (req, res) => {
    res.render("./main_page/site_introduction");
});

module.exports = router;