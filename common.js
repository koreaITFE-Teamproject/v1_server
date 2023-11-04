function formatDt() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, 0);
    const day = String(date.getDate()).padStart(2, 0);
    const hours = String(date.getHours()).padStart(2, 0);
    const minutes = String(date.getMinutes()).padStart(2, 0);
    const seconds = String(date.getSeconds()).padStart(2, 0);

    console.log(`${year}${month}${day}${hours}${minutes}${seconds}`);
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function checkLoginStatus(req) {
    if (typeof req.session.isLogined === 'undefined') {                 // 세션에 is_logined가 없을 때
        return false;                                                   // false
    } else {                                                            // 있을때
        return { isLogined: true, nickname: req.session.nickname };     // true, 닉네임
    }
}

module.exports = {
    formatDt,
    checkLoginStatus
}