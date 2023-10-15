$(function () {
    var minute = 2;
    var second = 59;
    var times;
    var remainingTime;

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
});