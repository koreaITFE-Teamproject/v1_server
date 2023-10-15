$(document).ready(function () {
    // 마우스 모양 바뀜
    $(".bi").mouseover(function () {
        $(this).css('cursor', 'pointer');
    })

    //화면 맨 위로 올라가게 하는 코드
    $("#up_btn").on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 'slow');

    })

    //화면 맨 아래로 내려가게 하는 코드
    $("#up_btn").on('click', function () {
        var windowHeight = $(window).height();
        $('html, body').animate({ scrollTop: windowHeight }, 'slow');
    })

    // 기본 위치(top)값
    
    
})
// scroll 인식
$(window).scroll(function () {
    
    var floatPosition = parseInt($("#banner_div").css('top'))

    // 현재 스크롤 위치
    var currentTop = $(window).scrollTop();
    var bannerTop = currentTop + floatPosition + "px";

    //이동 애니메이션
    $("#banner_div").stop().animate({
        "top": bannerTop
    }, 500);

}).scroll();