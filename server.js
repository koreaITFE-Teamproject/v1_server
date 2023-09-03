const express = require("express");
const app = express();
const cors = require("cors");

const mysql = require("mysql2");

app.use(cors());

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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
