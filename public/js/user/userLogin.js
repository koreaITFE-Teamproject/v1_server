$(function () {
    var minute = 2;
    var second = 59;
    var times;
    var remainingTime;

    $("#login-form").submit(function (event) {
        const id = $("#login-id").val();
        const pw = $("#login-pw").val();
        isValid(event, id, pw);                           // 유효성 검사 후 server로 전송
    });

    // 유효성 검사
    function isValid(event, id, pw) {
        if (!id.trim() || !pw.trim()) {                             // 공백 검사
            alert("아이디 또는 비밀번호를 입력하세요.");
            return event.preventDefault();
        }

        if (!(id.length >= 7 && id.length <= 20) || !(pw.length >= 10 && pw.length <= 30)) {
            alert("아이디 또는 비밀번호의 글자 수를 확인해주세요.");    // 글자 수 검사
            return event.preventDefault();
        }
    }

    $(".qr-btn").click(function () {
        remainingTime = setInterval(function () {
            checkTime();
            times = `${checkLessThanTen(minute)}분 ${checkLessThanTen(second-- - 1)}초`;
            $(".time").text(times);
        }, 1000);

        $(".modal").toggle();
    });

    $(".fa-xmark").click(function () {
        $(".modal").toggle();
        clearInterval(remainingTime);
        $(".time").text("02분 59초");
        minute = 2;
        second = 59;
    })


    function checkTime() {
        if (minute == 0 && second == 0) {
            clearInterval(remainingTime);
            minute = 2;
            second = 59;
            return $(".modal").toggle();
        }

        if (second == 0) {
            minute--;
            second = 59;
        }
    }

    function checkLessThanTen(time) {
        return time < 10 ? `0${time}` : time;
    }


    // 비밀번호 표시
    $("#show-eyes").click(function () {
        showIconToggle();
        $("#login-pw").attr("type", "password");
    });

    $("#hide-eyes").click(function () {
        showIconToggle();
        $("#login-pw").attr("type", "text");
    });

    function showIconToggle(){
        $("#show-eyes").toggle();
        $("#hide-eyes").toggle();
    }
});