const express = require("express");
const app = express();
const cors = require("cors");
const expressLayouts = require('express-ejs-layouts');    // ejs layout
const mysql = require("mysql2");                          // mysql(DB)
const bodyParser = require("body-parser");                // body-parser

const cookieParser = require("cookie-parser");            // cookie-parser, 일단 사용x
const session = require("express-session");               // express-session

// .env 파일 사용하려면 root에 추가해야함, 일단 사용X        // SECRET_KEY_CS=testSecretKey
// require("dotenv").config();                            // .env 파일 불러오기
// const secretKeyCs = process.env.SECRET_KEY_CS;         // .env file에 저장한 쿠기, 세션 키 -> env file: 환경변수파일
// console.log("secretKey: ", secretKeyCs);               // .env 파일 불러와 지는지 테스트

app.set("view engine", "ejs");                            // EJS 설정
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use(express.static("./public/css"));                  // css
app.use(express.static("./public/js"));                   // js
app.use(express.static("./public/img"));                  // image

app.set("layout extractScripts", true);                   // layout script 불러오기
app.set('layout', 'common/layout');                       // layout 경로
app.use(expressLayouts);

app.use(cookieParser());
app.use(session({
  secret: "secretKey",                                    // 쿠키에 서명 추가, .env 파일에서 가져온 secretKey, (일단 임시로 재지정)
  resave: false,                                          // 세션 변동사항이 없을때 다시 저장한 것인지
  saveUninitialized: false,                               // 세션에 저장할 내용이 없을때 처음부터 세션을 설정할 것인지
  cookie: {
    httpOnly: true,                                       // 보안, 스크립트로 쿠키 탈취 방지
    secure: false                                         // 보안, https를 사용하지 않는 사이트에 대해 쿠키 전송 방지
  },
}));

// MySQL 접속 주소를 기반으로 연결 정보 설정
const connection = mysql.createConnection({
  host: "139.150.69.126",                                 // MySQL 호스트 주소
  user: "root",                                           // MySQL 사용자 이름
  password: "Koreait1234!",                               // MySQL 비밀번호
  database: "koreait",                                    // 연결할 데이터베이스 이름
  port: 3306,                                             // MySQL 포트 번호
  ssl: {
    rejectUnauthorized: false,                            // SSL 설정 (주의: 개발 환경에서만 사용)
    require: true,
  },
});

// MySQL 연결
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL database.");
  }
});

app.get("/getList", (req, res) => {
  // 데이터베이스 조회 쿼리
  const query = "SELECT * FROM USER_INFO";                // 본인의 테이블 이름으로 수정
  connection.query(query, (queryErr, results) => {
    if (queryErr) {
      console.error("Error executing query:", queryErr);
      res.status(500).send("Internal Server Error");
      return;
    }

    console.log("Database results:", results);

    res.json(results);
  });
});

// 서버 종료 시 MySQL 연결 종료
process.on("SIGINT", () => {
  connection.end((endErr) => {
    if (endErr) {
      console.error("Error ending connection:", endErr);
    } else {
      console.log("Connection to MySQL database closed.");
    }
    process.exit(); // 서버 종료
  });
});

app.get("/", (req, res) => {
  res.redirect("./main/home");
});

module.exports = connection;    // 라우터에서도 mysql 사용하기 위해 exports

// routes
const mainRoute = require("./routes/main");
const userRoute = require("./routes/user");
const discussionRoute = require("./routes/discussion");
const customerRoute = require("./routes/customer");
const columnRoute = require("./routes/column");

app.use("/main", mainRoute);
app.use("/user", userRoute);
app.use("/discussion", discussionRoute);
app.use("/customer", customerRoute);
app.use("/column", columnRoute);


app.post("/likeColumn", (req, res) => {
  let columnId = req.body.columnId;

  const updateQuery = "UPDATE BK_COLUMN SET like_count = COALESCE(like_count, 0) + 1 WHERE colmn_uniqu_id = ?";

  connection.query(updateQuery, [columnId], (updateErr, updateResults) => {
    if (updateErr) {
      console.error("Error executing update query:", updateErr);
      res.status(500).send("Internal Server Error");
      return;
    }

    const selectQuery = "SELECT COALESCE(like_count, 0) as like_count FROM BK_COLUMN WHERE colmn_uniqu_id = ?";
    connection.query(selectQuery, [columnId], (selectErr, selectResults) => {
      if (selectErr) {
        console.error("Error executing select query:", selectErr);
        res.status(500).send("Internal Server Error");
        return;
      }

      const likeCount = selectResults[0].like_count;

      res.json({ like_count: likeCount });
    });
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});