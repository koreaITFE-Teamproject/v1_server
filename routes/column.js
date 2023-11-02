const express = require("express");
const commonFunc = require("../common");
const connection = require("../server.js"); // mysql 사용하기 위해 require
const router = express.Router();

// 컬럼
// 전체 컬럼
router.get("/all", (req, res) => {
    userInfo = commonFunc.checkLoginStatus(req);        // 리턴값 받음
    userInfo === false ? isLogined = { isLogined: false, nickname: "" } : userInfo;

    res.render("./user/column/maincolumn/columnListCopy", { isLogined: userInfo });
});

// 구독 컬럼
router.get("/sub", (req, res) => {
    res.render("./user/column/maincolumn/subColumn");
});

// 좋아요 컬럼
router.get("/like", (req, res) => {
    res.render("./user/column/maincolumn/likeColumn");
});

// 컬럼 작성
router.get("/write", (req, res) => {
    res.render("./user/column/writeColumn/writeColumn");
});

// 컬럼 읽기
router.get("/read/:colNo", (req, res) => {
    const columnNo = parseInt(req.params.colNo);

    const query = `
        SELECT BC.colmn_uniqu_id as c_id, BC.sj, BC.writng_time as wt, BC.cn, BC.colmn_cl_setup as cs, UI.ncnm as nm
        FROM BK_COLUMN as BC
        inner join USER_INFO as UI
        WHERE colmn_uniqu_id = ${columnNo} and UI.user_id = BC.colmn_wrter
    `;

    connection.query(query, (queryErr, results) => {
        if (queryErr) {
            console.error("Error executing query:", queryErr);
            res.status(500).send("Internal Server Error");
            return;
        }

        // console.log(results);

        results[0].wt = commonFunc.formatDt(results[0].wt);             // 날짜, 시간 포멧팅

        res.render("./user/column/maincolumn/read", { column: results[0] });
    });
});

router.get("/getList", (req, res) => {
    // 페이지 번호와 페이지 크기를 쿼리 파라미터로부터 가져옵니다.
    const page = req.query.page || 1;       // 기본 페이지는 1입니다.
    const pageSize = 10;                    // 페이지 크기 (한 페이지당 표시할 행 수)
    const searchQuery = req.query.search;   // 검색어를 쿼리 파라미터로부터 가져옵니다.
    const columnType = req.query.type;      // 셀렉트 박스 칼럼 유형 가져옴

    // 전체 항목 수를 가져오는 쿼리
    const countQuery = `
                        SELECT COUNT(*) AS total
                        FROM BK_COLUMN
                        WHERE ? AND ? OR SJ LIKE ? AND colmn_cl_setup LIKE ?
                    `;

    // 전체 항목 수를 가져온 후 전체 페이지 수를 계산합니다.
    connection.query(
        countQuery,
        [!searchQuery, !columnType, searchQuery ? `%${searchQuery}%` : '%%', columnType ? `%${columnType}` : '%'],
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
                CN,
                (SELECT CL.colmn_cl_nm FROM COLMN_CL AS CL INNER JOIN BK_COLUMN AS BC ON CL.colmn_cl_id = BC.colmn_cl_setup
                WHERE COLMN_UNIQU_ID = bc.COLMN_UNIQU_ID) AS COLMN_CL_NM,
                DATE_FORMAT(WRITNG_TIME, '%Y.%m.%d.') AS WRITNG_TIME,
                HIT,
                REPLY_COUNT,
                LIKE_COUNT,
                (SELECT NCNM FROM USER_INFO WHERE USER_ID = COLMN_WRTER ) AS COLMN_WRTER
                FROM (SELECT * FROM BK_COLUMN
                WHERE ? AND ? OR SJ LIKE ? AND colmn_cl_setup LIKE ?) bc
                ORDER BY COLMN_UNIQU_ID DESC
                LIMIT ? OFFSET ?
            `;

            // 쿼리 매개변수로 pageSize와 offset을 전달합니다.
            connection.query(
                dataQuery,
                [!searchQuery, !columnType, searchQuery ? `%${searchQuery}%` : '%%', columnType ? `%${columnType}` : '%', pageSize, offset],
                (queryErr, results) => {
                    if (queryErr) {
                        console.error("Error executing data query:", queryErr);
                        res.status(500).send("Internal Server Error");
                        return;
                    }

                    // console.log("Database results:", results);

                    res.json({ data: results, totalPages });
                }
            );
        }
    );
});

// 칼럼 저장
router.post("/saveColumn", (req, res) => {
    console.log(req.body);
    const { sj, cn, ct, nm } = req.body;    // 클라이언트에서 전달된 데이터 'sj', 'cn', 'nm', 'ct 값을 가져옵니다.

    const insertQuery = `
      INSERT INTO BK_COLUMN (SJ, WRITNG_TIME, CN, colmn_cl_setup, COLMN_WRTER)
      VALUES (?, NOW(), ?, ?, (SELECT user_id FROM USER_INFO WHERE ncnm = ?))
    `;

    // 'sj', 'cn', 'ct', 'nm' 값을 데이터베이스에 삽입
    connection.query(insertQuery, [sj, cn, parseInt(ct), nm], (queryErr, result) => {
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
