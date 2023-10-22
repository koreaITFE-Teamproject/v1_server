function getRegistDt() {
    const today = new Date();
    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`
}

function checkLoginStatus(req) {
    if (typeof req.session.isLogined === 'undefined') {                 // 세션에 is_logined가 없을 때
        return false;                                                   // false
    } else {                                                            // 있을때
        return { isLogined: true, nickname: req.session.nickname };     // true, 닉네임
    }
}

module.exports = {
    getRegistDt,
    checkLoginStatus
}