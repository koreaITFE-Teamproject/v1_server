// 유저페이지 라우터

const express = require("express");
const commonFunc = require("../common");
const connection = require("../server.js"); // mysql 사용하기 위해 require
const CryptoJS = require("crypto-js"); // CryptoJS, SHA-256 사용위함 -> 비밀번호 암호화
const router = express.Router();

// 회원가입 get
router.get("/join", (req, res) => {
    res.render("./user/join");
});

// 회원가입 post
router.post("/join", (req, res) => {
    const hashPw = CryptoJS.SHA256(req.body.loginPw).toString();

    const query = `
        INSERT INTO USER_INFO (user_id, passwd, name, ncnm, email, telno, adres, secsn_ennc, srbde, mber_author, secsn_reqstdt)
            VALUES ('${req.body.loginId}', '${hashPw}', '${req.body.name}', '${req.body.nickname}',
            '${req.body.email}', '${req.body.telno}', '${req.body.address}', 0, NOW(), 0, "")
    `;

    connection.query(query, (queryErr, results) => {
        if (queryErr) {
            console.error("Error executing query:", queryErr);
            res.status(500).send("Internal Server Error");
            return;
        }
        res.redirect("/user/login");
    });
});

// 회원가입 중복 체크
router.post("/duplicate", (req, res) => {
    const dbType = req.body.idx == 0 ? "user_id" : "ncnm";
    const inputVal = req.body.val;
    const query = `SELECT ${dbType} from USER_INFO WHERE ${dbType}='${inputVal}'`;
    connection.query(query, (queryErr, results) => {
        // db 체크
        if (queryErr) {
            console.error("Error executing query:", queryErr);
            res.status(500).send("Internal Server Error");
            return;
        } else if (results.length > 0) {
            // 중복 될 때
            res.json({ isTrue: true });
        } else {
            // 중복 안될 때
            res.json({ isTrue: false });
        }
    });
});

// 로그인 get
router.get("/login", (req, res) => {
    userInfo = commonFunc.checkLoginStatus(req);
    if (userInfo === false) {
        // 로그인 여부가 false 일 때
        res.render("./user/login");
    } else {
        res.send(
            `<script type="text/javascript">alert("이미 로그인 되어있습니다."); document.location.href="../main/home";</script>`
        );
    }
});

// 로그인 post
router.post("/login", (req, res) => {
    const loginId = req.body.loginId;
    const hashPw = CryptoJS.SHA256(req.body.loginPw).toString();

    const query = `SELECT user_uniq_id as u_id, user_id, ncnm from USER_INFO WHERE user_id='${loginId}' AND passwd='${hashPw}'`;
    connection.query(query, (queryErr, results) => {
        // db 체크
        if (queryErr) throw queryErr;

        if (results.length > 0) {
            // db 유저 정보와 일치한 데이터가 있을 때
            req.session.isLogined = true;           // 세션 정보 갱신, 로그인 여부
            req.session.userNo = results[0].u_id;   // 유저 고유번호 저장
            req.session.userId = loginId;           // 유저 아이디 저장
            req.session.nickname = results[0].ncnm; // 유저 닉네임 저장
            req.session.save(function () {
                res.redirect("../main/home");
            });
        } else {
            // 없을 때
            res.send(
                `<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); document.location.href="login";</script>`
            );
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
        res.send(
            `<script type="text/javascript">alert("로그인 후 이용 가능합니다."); document.location.href="login";</script>`
        );
    } else {
        const query = `SELECT * from USER_INFO WHERE ncnm='${userInfo.nickname}'`;
        connection.query(query, (queryErr, results) => {
            // db 체크
            if (queryErr) throw queryErr;

            console.log(results);

            res.render("./user/modify", { userInfo, userResults: results });
        });
    }
});

// 비밀번호 변경
router.get("/passwd_reset", (req, res) => {
    userInfo = commonFunc.checkLoginStatus(req);
    if (userInfo === false) {
        // 로그인 여부가 false 일 때
        res.send(
            `<script type="text/javascript">alert("로그인 후 이용가능합니다."); document.location.href="../user/login";</script>`
        );
    } else {
        res.render("./user/passwd/passwd_reset");
    }
});

// 비밀번호 찾기
router.get("/passwd_find", (req, res) => {
    res.render("./user/passwd/passwd");
});

// 비밀번호 존재하는지
router.post("/existPw", (req, res) => {
    const hashPw = CryptoJS.SHA256(req.body.pw).toString();
    const query = `SELECT passwd from USER_INFO WHERE ncnm = '${req.body.ncnm}' AND passwd = '${hashPw}'`;
    connection.query(query, (queryErr, results) => {
        // db 체크
        if (queryErr) throw queryErr;

        if (results.length > 0) {           // 존재할 경우
            res.json({isExist: true});
        } else {                            // 없는 경우
            res.json({isExist: false});
        }
    });
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

module.exports = router;
