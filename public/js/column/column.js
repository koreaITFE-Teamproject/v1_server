$(function () {

    $(".option_bar li").click(function () {
        discussPath($(this).text());;

        $(".option_bar li").css({
            "fontWeight": "normal",
            "borderBottom": 0,
        });
        $(this).css({
            "fontWeight": "bold",
            "borderBottom": "2px solid #764127",
        });
    });

    discussPath("전체 칼럼");
    function discussPath($text) {
        $("#change-path").text($text);
    }
});