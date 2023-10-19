// 유저페이지 라우터

const express = require("express");
const connection = require("../server.js");     // mysql 사용하기 위해 require
const router = express.Router();

// 회원가입
router.get("/join", (req, res) => {
    res.render("./user/join");
});



// 로그인 get
router.get("/login", (req, res) => {
    res.render("./user/login");
});

// 로그인 post
router.post("/login", (req, res) => {
    const loginId = req.body.loginId;
    const loginPw = req.body.loginPw;

    const query = `SELECT user_id, passwd from USER_INFO WHERE user_id='${loginId}' AND passwd='${loginPw}'`;
    connection.query(query, (queryErr, results) => {        // db 체크
        if (queryErr) throw queryErr;

        if (results.length > 0) {                           // db 유저 정보와 일치한 데이터가 있을 때
            req.session.is_logined = true;                  // 세션 정보 갱신
            req.session.userId = loginId;
            req.session.save(function () {
                res.redirect("../main/home");
            });
            console.log(results[0].user_id, results[0].passwd);
        } else {                                            // 없을 때
            res.send(`<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); document.location.href="login";</script>`);
        }
    });
});

// 로그아웃
router.get("/logout", (req, res) => {
    req.session.destroy(function (err) {
        res.redirect("../main/home");
    });
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