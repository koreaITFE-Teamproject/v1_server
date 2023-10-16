// 토론방 라우터

const express = require("express");
const connection = require("../server.js");     // mysql 사용하기 위해 require
const router = express.Router();

// 토론방 목록
router.get("/room_list", (req, res) => {
    const query = "SELECT dr.*, ui.ncnm FROM USER_INFO AS ui INNER JOIN DSCSN_ROOM AS dr ON dr.user_uniq_id = ui.user_uniq_id;";

    connection.query(query, (queryErr, results) => {
        if (queryErr) {
            console.error("Error executing query:", queryErr);
            res.status(500).send("Internal Server Error");
            return;
        }

        console.log("Database results:", results);

        // res.json(results);
        res.render("./discussion/discussion_room", { rooms: results });
    });
});

// 토론방 (일반)
router.get("/chatting_room", (req, res) => {
    res.render("./discussion/chatting_room");
});

// 토론방 (화상)
router.get("/video_chat_room", (req, res) => {
    res.render("./discussion/video_chat_room");
});

// 토론방 생성
router.get("/create_room", (req, res) => {
    res.render("./discussion/newRoom");
});

// 토론방 생성 db 추가
router.post("/create_room", (req, res) => {
    const createRoomData = req.body;
    console.log(createRoomData);

    const today = new Date();
    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);
    const datePormat = `${year}-${month}-${day}`

    // dscsn_id -> auto increment 추가 해야할 듯
    const query = `
        INSERT INTO DSCSN_ROOM (dscsn_id, user_uniq_id, dscsn_room_nm, crtr_id, dscsn_room_creat_de, dscsn_room_delete_de)
        VALUES(2, 1, '${req.body.room_name}', '${req.body.chatType}', '${datePormat}', '${datePormat}')
        `;

    connection.query(query, (queryErr, results) => {
        if (queryErr) {
            console.error("Error executing query:", queryErr);
            res.status(500).send("Internal Server Error");
            return;
        }

        console.log("Database results:", results);

        // res.json(results);
        res.redirect("/discussion/room_list");
    });
});


// 유저 정보 조회       /discussion/userInfo
// router.get("/userInfo", (req, res) => {
//     const query = "SELECT * FROM USER_INFO";
//     connection.query(query, (queryErr, results) => {
//       if (queryErr) {
//         console.error("Error executing query:", queryErr);
//         res.status(500).send("Internal Server Error");
//         return;
//       }

//       console.log("Database results:", results);

//       res.json(results);
//     });
//   });

// 유저 정보 추가, 일단 1번만 추가
// router.get("/userInfo", (req, res) => {
//   const today = new Date();
//   var year = today.getFullYear();
//   var month = ('0' + (today.getMonth() + 1)).slice(-2);
//   var day = ('0' + today.getDate()).slice(-2);
//   const datePormat = `${year}-${month}-${day}`

//   const query = `
//     INSERT INTO USER_INFO (user_uniq_id, user_id, passwd, name, ncnm, email, telno, adres, secsn_ennc, srbde, mber_author, secsn_reqstdt)
//     VALUES('1', '장성훈', '장성훈', '장성훈', '성훈', 'test@gmail.com', 01012345678, '대전', '1', '${datePormat}', 1, '1')
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