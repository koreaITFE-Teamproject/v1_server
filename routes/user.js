// 유저페이지 라우터

const express = require("express");
const commonFunc = require("../common");
const connection = require("../server.js");     // mysql 사용하기 위해 require
const router = express.Router();

// 회원가입
router.get("/join", (req, res) => {
    res.render("./user/join");
});



// 로그인 get
router.get("/login", (req, res) => {
    userInfo = commonFunc.checkLoginStatus(req);
    if (userInfo === false) {                       // 로그인 여부가 false 일 때
        res.render("./user/login");
    } else {
        res.send(`<script type="text/javascript">alert("이미 로그인 되어있습니다."); document.location.href="../main/home";</script>`);
    }
});

// 로그인 post
router.post("/login", (req, res) => {
    const loginId = req.body.loginId;
    const loginPw = req.body.loginPw;

    const query = `SELECT user_id, ncnm from USER_INFO WHERE user_id='${loginId}' AND passwd='${loginPw}'`;
    connection.query(query, (queryErr, results) => {        // db 체크
        if (queryErr) throw queryErr;

        if (results.length > 0) {                           // db 유저 정보와 일치한 데이터가 있을 때
            req.session.isLogined = true;                   // 세션 정보 갱신, 로그인 여부
            req.session.userId = loginId;                   // 아이디 저장
            req.session.nickname = results[0].ncnm;         // 닉네임 저장
            req.session.save(function () {
                res.redirect("../main/home");
            });
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
    userInfo = commonFunc.checkLoginStatus(req);
    if (userInfo === false) {
        res.send(`<script type="text/javascript">alert("로그인 후 이용 가능합니다."); document.location.href="login";</script>`);
    } else {
        const query = `SELECT * from USER_INFO WHERE ncnm='${userInfo.nickname}'`;
        connection.query(query, (queryErr, results) => {        // db 체크
            if (queryErr) throw queryErr;

            console.log(results);

            res.render("./user/modify", { userInfo, userResults: results });
        });
    }
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


// 유저 정보 조회       /user/userInfo
// router.get("/userInfo", (req, res) => {
//     const query = "SELECT * FROM USER_INFO";        // 조회
//     // const query = "UPDATE USER_INFO SET telno = '01012340002' where user_uniq_id = 2";       // 수정
//     connection.query(query, (queryErr, results) => {
//         if (queryErr) {
//             console.error("Error executing query:", queryErr);
//             res.status(500).send("Internal Server Error");
//             return;
//         }

//         console.log("Database results:", results);

//         res.json(results);
//     });
// });

// 유저 정보 추가
// router.get("/userInfo", (req, res) => {
//   const today = new Date();
//   var year = today.getFullYear();
//   var month = ('0' + (today.getMonth() + 1)).slice(-2);
//   var day = ('0' + today.getDate()).slice(-2);
//   const datePormat = `${year}-${month}-${day}`

//   const query = `
//     INSERT INTO USER_INFO (user_uniq_id, user_id, passwd, name, ncnm, email, telno, adres, secsn_ennc, srbde, mber_author, secsn_reqstdt)
//     VALUES('2', 'testId02', 'testPw02!@', '장성현', 'hello', 'test02@gmail.com', 01012340002, '대전', '2', '${datePormat}', 2, '2')
//   `;
//   connection.query(query, (queryErr, results) => {
//     if (queryErr) {
//       console.error("Error executing query:", queryErr);
//       res.status(500).send("Internal Server Error");
//       return;
//     }

//     console.log("Database results:", results);

//     res.json(results);
//   });
// });


module.exports = router;