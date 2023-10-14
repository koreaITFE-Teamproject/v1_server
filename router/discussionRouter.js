// 토론방 라우터

const express = require("express");
const router = express.Router();

// 토론방 목록
router.get("/room_list", (req, res) => {
    res.render("./page/discussion/discussion_room");
});

// 토론방 (일반)
router.get("/chatting_room", (req, res) => {
    res.render("./page/discussion/chatting_room");
});

// 토론방 (화상)
router.get("/video_chat_room", (req, res) => {
    res.render("./page/discussion/video_chat_room");
});

// 토론방 생성
router.get("/create_room", (req, res) => {
    res.render("./page/discussion/newRoom");
});



module.exports = router;