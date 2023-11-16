const express = require("express");
const fs = require('fs');
const commonFunc = require("../common");
const connection = require("../server.js"); // mysql 사용하기 위해 require
const router = express.Router();
const multer = require("multer");                   // multer 파일 전송 npm
const storage = multer.diskStorage({                // 이미지 업로드 목적지
    destination: function (req, file, cb) {
        cb(null, './public/img/columnImg')          // 폴더 경로
    },
    filename: function (req, file, cb) {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');      // 한글 깨짐 현상때문에 추가
        // 확장자만 자르기
        const fileName = file.originalname.slice(0, file.originalname.length - 4);
        const ext = file.originalname.slice(-4);
        cb(null, fileName + "_" + commonFunc.formatDt() + ext);                             // 업로드하는 파일명 + 현재 날짜로 저장
    },
    // fileFilter: function (req, fild, cb) {                                               // 확장자 필터링    -> 필터 작동 안하는거 같음
    //     var ext = path.extname(file.originalname);
    //     if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
    //         return cancelIdleCallback(new Error("PNG, JPG만 업로드하세요."));
    //     }
    //     cancelIdleCallback(null, true);
    // },
    // limits: {                                                                            // 파일 사이즈 제한
    //     fileSize: 1024 * 1024,
    // },
});

// 업로드 미들웨어 설정
var upload = multer({ storage: storage });
let imgPath = "";       // 이미지 경로 설정

// 이미지 업로드, 이미지 한개일때 single 메서드 사용, 인자는 칼럼 작성페이지에 지정한 input file타입의 name: imgFile
router.post("/uploadImg", upload.single('imgFile'), (req, res) => {
    if (req.file) {
        imgPath = `/columnImg/${req.file.filename}`;
        res.json({ fn: req.file.filename, imgPath });
    } else {
        res.send("파일 업로드 실패");
    }
});

// 이미지 지우기
router.post("/deleteImg", upload.single('imgFile'), (req, res) => {
    const imgFn = req.body.imgFn;
    console.log(imgFn);
    if (!imgFn) {
        res.json({ msg: "선택된 이미지 파일이 없습니다." });
    } else {
        fs.unlink(`./public/img${imgFn}`, (err) => {
            if (err) {
                return console.log("파일 삭제 오류: ", err);
            } else {
                imgPath = "";   // 이미지 경로 초기화
                res.json({ msg: "이미지 제거 완료" });
            }
        });
    }
});

// 컬럼
// 전체 컬럼
router.get("/all", (req, res) => {
    userInfo = commonFunc.checkLoginStatus(req);        // 리턴값 받음
    userInfo === false ? isLogined = { isLogined: false, nickname: "" } : userInfo;

    res.render("./user/column/maincolumn/columnList", { isLogined: userInfo, type: '' });
});

// 메인에서 칼럼 유형 선택하고 들어올 때
router.get("/all/:id", (req, res) => {

    userInfo = commonFunc.checkLoginStatus(req);        // 리턴값 받음
    userInfo === false ? isLogined = { isLogined: false, nickname: "" } : userInfo;

    res.render("./user/column/maincolumn/columnList", { isLogined: userInfo, type: req.params.id });
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
    if (req.session.isLogined === undefined) {
        res.send(`<script>alert("로그인 후 이용 가능합니다."); document.location.href="../user/login";</script>`);
    } else {
        res.render("./user/column/writeColumn/writeColumn", { colInfo: false });
    }
});

// 칼럼 수정
router.get("/modify/:id", (req, res) => {
    if (req.session.isLogined === undefined) {
        res.send(`<script>alert("로그인 후 이용 가능합니다."); window.location.href="../../../user/login";</script>`);
    } else {

        const colId = req.params.id;

        const query = `
        SELECT sj, cn, colmn_cl_setup as ccs, colmn_img_path as \`cip\`
        from BK_COLUMN
        WHERE colmn_uniqu_id = ${colId}
    `;

        connection.query(query, (queryErr, results) => {
            if (queryErr) {
                console.error("Error executing query:", queryErr);
                res.status(500).send("Internal Server Error");
                return;
            }

            // console.log(results);

            res.render("./user/column/writeColumn/writeColumn", { colInfo: results[0], colId });
        });
    }
});

// 칼럼 업데이트
router.post("/update", (req, res) => {
    const { sj, cn, ct, imgFn, colNo } = req.body;

    console.log(imgFn);

    const query = `
        UPDATE BK_COLUMN 
        SET sj = ?, cn = ?, colmn_cl_setup = ?, colmn_img_path = ?
        WHERE colmn_uniqu_id = ?
    `;

    connection.query(query, [sj, cn, ct, imgFn, colNo], (queryErr, results) => {
        if (queryErr) {
            console.error("Error executing query:", queryErr);
            res.status(500).send("Internal Server Error");
            return;
        }

        console.log(results);

        // res.json({ status: "SUCCESS", message: "Data updated successfully" });
    });
});

// 컬럼 읽기
let views = [];

router.get("/read/:colNo", (req, res) => {
    const columnNo = parseInt(req.params.colNo);

    const hitQuery = `SELECT colmn_uniqu_id as id, hit from BK_COLUMN WHERE colmn_uniqu_id = ${columnNo}`;
    connection.query(hitQuery, (queryErr, hitResults) => {
        if (queryErr) {
            console.error("Error executing query:", queryErr);
            res.status(500).send("Internal Server Error");
            return;
        }

        console.log(hitResults[0]);

        let columnTemp = null;

        if (!!req.session.isLogined) {
            columnTemp = views.find((colId) => colId.id === columnNo) === undefined ? views.push(hitResults[0]) : undefined;

            if (columnTemp === undefined) {
                return getColumn(res, req, columnNo);
            }

            const updateQuery = `
                UPDATE BK_COLUMN SET hit = hit + 1 WHERE colmn_uniqu_id = ${columnNo};
            `;

            connection.query(updateQuery, (queryErr, results) => {
                if (queryErr) {
                    console.error("Error executing query:", queryErr);
                    res.status(500).send("Internal Server Error");
                    return;
                }

                console.log(views);
                getColumn(res, req, columnNo);
            });
        } else {
            views = [];
            console.log(views, "초기화");
            getColumn(res, req, columnNo);
        }
    });
});

// 칼럼 유형 추가하려면 ,(SELECT colmn_cl_nm from COLMN_CL WHERE colmn_cl_id = 3) as col_type      이거 추가하면됨
function getColumn(res, req, columnNo) {
    const query = `
        SELECT BC.colmn_uniqu_id as c_id, BC.sj, DATE_FORMAT(BC.writng_time, '%Y.%m.%d.') as wt,
        BC.cn, BC.hit, BC.like_count,
        (SELECT COUNT(colmn_id) from REPLY WHERE colmn_id = ${columnNo}) as reply_count,
        BC.colmn_cl_setup as cs, UI.ncnm as nm, UI.user_uniq_id as u_no
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

        res.render("./user/column/maincolumn/read", { column: results[0], userNo: req.session.userNo });
    });
}

// 좋아요 가져오기
router.post("/getLikeColumn", (req, res) => {

    let columnId = req.body.columnId;
    let userNm = !req.session.nickname ? "" : req.session.nickname;

    const selectQuery = `
        SELECT
            COUNT(colmn_id) as like_count
            from COLUMN_LIKE
            WHERE colmn_id = ?
    `;

    connection.query(selectQuery, [columnId], (selectErr, selectResults) => {
        if (selectErr) {
            console.error("Error executing select query:", selectErr);
            res.status(500).send("Internal Server Error");
            return;
        }

        const likeCount = selectResults[0].like_count;

        const query = `
            SELECT
                frst_reg_id as user_name
                from COLUMN_LIKE
                WHERE colmn_id = ? AND frst_reg_id LIKE ?
        `;

        connection.query(query, [columnId, userNm.length == 0 ? '' : `%${userNm}%`], (err, results) => {
            if (err) {
                console.error("Error executing select query:", err);
                res.status(500).send("Internal Server Error");
                return;
            }

            console.log(results);
            console.log(results[0]);

            res.json({ like_count: likeCount, user_nm: results[0] });
        });
    });
});


// 좋아요 업데이트
router.post("/updateLikeColumn", (req, res) => {

    const columnId = req.body.columnId;
    const alreadyLiked = req.body.alreadyLiked == "true" ? true : false;
    const userNm = req.session.nickname;

    let updateQuery = !alreadyLiked ?
        "INSERT INTO COLUMN_LIKE SET colmn_id = ?, frst_reg_id = ?, frst_reg_dt = NOW()":
        "DELETE FROM COLUMN_LIKE WHERE colmn_id = ? AND frst_reg_id = ?"

    connection.query(updateQuery, [columnId, userNm], (err, results) => {
        if (err) {
            console.error("Error executing update query:", err);
            res.status(500).send("Internal Server Error");
            return;
        }

        return res.json({ status: "SUCCESS", message: "Data inserted successfully" });
    });
});

// 댓글 저장
router.post("/saveReply", (req, res) => {

    const { colNo, replyText } = req.body;
    const userNm = req.session.nickname;

    const insertQuery = `
        INSERT INTO REPLY (reply_cn, frst_reg_id, frst_reg_dt, colmn_id)
        VALUES (?, ?, NOW(), ?)
    `;

    connection.query(insertQuery, [replyText, userNm, colNo], (queryErr, insertResults) => {
        if (queryErr) {
            console.error("Error executing data query:", queryErr);
            res.status(500).send("Internal Server Error");
            return;
        }

        res.json({ status: "SUCCESS", message: "Data inserted successfully" });
    });
});

// 댓글 가져오기
router.post("/getReply", (req, res) => {
    const colNo = req.body.colNo;

    const selectQuery = `
        SELECT reply_cn, frst_reg_id, DATE_FORMAT(frst_reg_dt, '%y.%m.%d.') as wt, reply_delete_ennc as del
        from REPLY
        WHERE colmn_id = ${colNo};
    `;

    connection.query(selectQuery, (queryErr, Results) => {
        if (queryErr) {
            console.error("Error executing data query:", queryErr);
            res.status(500).send("Internal Server Error");
            return;
        }
        // console.log(Results);

        res.json(Results);
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
                (SELECT COUNT(colmn_id) FROM REPLY WHERE colmn_id = COLMN_UNIQU_ID) AS REPLY_COUNT,
                (SELECT COUNT(colmn_id) FROM COLUMN_LIKE WHERE colmn_id = COLMN_UNIQU_ID) AS LIKE_COUNT,
                colmn_img_path AS cip,
                (SELECT NCNM FROM USER_INFO WHERE USER_ID = COLMN_WRTER ) AS COLMN_WRTER
                FROM (SELECT * FROM BK_COLUMN
                WHERE ? AND ? OR SJ LIKE ? AND colmn_cl_setup LIKE ?) bc
                ORDER BY COLMN_UNIQU_ID DESC
                LIMIT ? OFFSET ?
            `;

            // 쿼리 매개변수로 pageSize와 offset을 전달합니다.
            connection.query(
                dataQuery,
                [!searchQuery, !columnType, searchQuery ? `%${searchQuery}%` : '%%', columnType ? `${columnType}` : '%%', pageSize, offset],
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
    // console.log(req.body);
    const { sj, cn, ct, nm } = req.body;    // 클라이언트에서 전달된 데이터 'sj', 'cn', 'nm', 'ct 값을 가져옵니다.

    const insertQuery = `
      INSERT INTO BK_COLUMN (SJ, WRITNG_TIME, CN, colmn_cl_setup, COLMN_WRTER, colmn_img_path)
      VALUES (?, NOW(), ?, ?, (SELECT user_id FROM USER_INFO WHERE ncnm = ?), ?)
    `;

    // 'sj', 'cn', 'ct', 'nm', 'imgPath' 값을 데이터베이스에 삽입
    connection.query(insertQuery, [sj, cn, parseInt(ct), nm, imgPath], (queryErr, result) => {
        if (queryErr) {
            console.error("Error executing insert query:", queryErr);
            res.status(500).send("Internal Server Error");
            return;
        }

        console.log("Data inserted successfully:", result);

        imgPath = "";

        // 성공 응답을 클라이언트에 보냅니다.
        res.json({ status: "SUCCESS", message: "Data inserted successfully" });
    });
});

module.exports = router;
