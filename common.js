function getRegistDt() {
    const today = new Date();
    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`
}

function checkLoginStatus(req) {
    if (typeof req.session.is_logined === 'undefined') {        // 세션에 is_logined가 없을 때
        return false;                                           // true
    } else {                                                    // 있을때
        return true;                                            // true
    }
}

module.exports = {
    getRegistDt,
    checkLoginStatus
}