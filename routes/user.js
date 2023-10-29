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

  const query = `SELECT user_id, ncnm from USER_INFO WHERE user_id='${loginId}' AND passwd='${hashPw}'`;
  connection.query(query, (queryErr, results) => {
    // db 체크
    if (queryErr) throw queryErr;

    if (results.length > 0) {
      // db 유저 정보와 일치한 데이터가 있을 때
      req.session.isLogined = true; // 세션 정보 갱신, 로그인 여부
      req.session.userId = loginId; // 아이디 저장
      req.session.nickname = results[0].ncnm; // 닉네임 저장
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

router.get("/getList", (req, res) => {
  // 페이지 번호와 페이지 크기를 쿼리 파라미터로부터 가져옵니다.
  const page = req.query.page || 1; // 기본 페이지는 1입니다.
  const pageSize = 10; // 페이지 크기 (한 페이지당 표시할 행 수)
  const searchQuery = req.query.search; // 검색어를 쿼리 파라미터로부터 가져옵니다.

  // 전체 항목 수를 가져오는 쿼리
  const countQuery = `
                        SELECT COUNT(*) AS total
                        FROM BK_COLUMN
                        WHERE ? OR SJ LIKE ?
                    `;

  // 전체 항목 수를 가져온 후 전체 페이지 수를 계산합니다.
  connection.query(
    countQuery,
    [!searchQuery, searchQuery ? `%${searchQuery}%` : ""],
    (countQueryErr, countResults) => {
      if (countQueryErr) {
        console.error("Error executing count query:", countQueryErr);
        res.status(500).send("Internal Server Error");
        return;
      }

      const totalItems = countResults[0].total;
      const totalPages = Math.ceil(totalItems / pageSize);

      // 페이지 번호를 기반으로 OFFSET 값을 계산합니다.
      const offset = (page - 1) * pageSize;

      // 실제 데이터를 가져오는 쿼리
      let dataQuery = `
                    SELECT 
                    COLMN_UNIQU_ID AS ROW_NUM,
                    SJ,
                    DATE_FORMAT(WRITNG_TIME, '%Y-%m-%d %H:%i:%s') AS WRITNG_TIME,
                    (SELECT NCNM FROM USER_INFO WHERE USER_ID = COLMN_WRTER) AS COLMN_WRTER
                    FROM 
                    (SELECT COLMN_UNIQU_ID, SJ, WRITNG_TIME, COLMN_WRTER
                    FROM BK_COLUMN
                    WHERE ? OR SJ LIKE ?
                    ) bc
                    ORDER BY COLMN_UNIQU_ID DESC   
                    LIMIT ? OFFSET ?
                `;

      // 쿼리 매개변수로 pageSize와 offset을 전달합니다.
      connection.query(
        dataQuery,
        [!searchQuery, searchQuery ? `%${searchQuery}%` : "", pageSize, offset],
        (queryErr, results) => {
          if (queryErr) {
            console.error("Error executing data query:", queryErr);
            res.status(500).send("Internal Server Error");
            return;
          }

          console.log("Database results:", results);

          res.json({ data: results, totalPages });
        }
      );
    }
  );
});

router.post("/saveColumn", (req, res) => {
  const { sj } = req.body; // 클라이언트에서 전달된 데이터 중 'sj' 값을 가져옵니다.

  const insertQuery = `
      INSERT INTO BK_COLUMN (SJ, WRITNG_TIME, COLMN_WRTER)
      VALUES (?, NOW(), ?)
    `;

  // 'sj' 값을 데이터베이스에 삽입
  connection.query(insertQuery, [sj, ""], (queryErr, result) => {
    if (queryErr) {
      console.error("Error executing insert query:", queryErr);
      res.status(500).send("Internal Server Error");
      return;
    }

    console.log("Data inserted successfully:", result);

    // 성공 응답을 클라이언트에 보냅니다.
    res.json({ status: "SUCCESS", message: "Data inserted successfully" });
  });
});

module.exports = router;
