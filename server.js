const express = require("express");
const app = express();
const cors = require("cors");
const expressLayouts = require('express-ejs-layouts');

const mysql = require("mysql2");

app.set("view engine", "ejs");      // EJS 설정

app.use(cors());
app.use(express.static("./views/css"));   // css
app.use(express.static("./views/js"));    // js
app.use(express.static("./views/img"));   // image

app.set("layout extractScripts", true);   // script 불러오기
app.set('layout', 'page/common/layout');  // layout 경로
app.use(expressLayouts);

// MySQL 접속 주소를 기반으로 연결 정보 설정
const connection = mysql.createConnection({
  host: "139.150.69.126", // MySQL 호스트 주소
  user: "root", // MySQL 사용자 이름
  password: "Koreait1234!", // MySQL 비밀번호
  database: "koreait", // 연결할 데이터베이스 이름
  port: 3306, // MySQL 포트 번호
  ssl: {
    rejectUnauthorized: false, // SSL 설정 (주의: 개발 환경에서만 사용)
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
  const query = "SELECT * FROM bk_column"; // 본인의 테이블 이름으로 수정
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

app.get("/test", (req, res) => {
  res.render("./page/main_page/test");
});



// routes
const mainRoute = require("./routes/main");
const userRoute = require("./routes/user");
const discussionRoute = require("./routes/discussion");
const customerRoute = require("./routes/customer");

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/main", mainRoute);
app.use("/user", userRoute);
app.use("/discussion", discussionRoute);
app.use("/customer", customerRoute);
