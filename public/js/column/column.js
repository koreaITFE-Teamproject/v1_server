//요소 싸그리 다 수정해야함.

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
  
    // var listHeight = parseInt($(".discussion-rooms-list").css("maxHeight"));
    // var ulHeight = 0;
  
    // $(".user-rooms-wrap>ul").each(function () {
    //     ulHeight += parseInt($(this).css("height"));
    // });
  
  
    // if (listHeight < ulHeight) {
    //     $(".room-title-wrap>ul:last-child").css("paddingRight", "5px");
    // } else {
    //     $(".room-title-wrap>ul:last-child").css("paddingRight", "0");
    // }
  });