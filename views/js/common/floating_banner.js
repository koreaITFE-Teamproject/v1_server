$(document).ready(function () {
    // 마우스 모양 바뀜
    $(".bi").mouseover(function () {
        $(this).css('cursor', 'pointer');
    })

    //화면 맨 위로 올라가게 하는 코드
    $("#up_btn").on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 'slow');
        // 코드 해석 
        // $('html, body'): 페이지의 html과 body 요소를 대상으로 애니메이션 적용
        // animate({ scrollTop: 0 }, 'slow') : scroollTop 속성을 이용하여 페이지의 스크롤 위치를 위로 0px로 이동하라는 의미.
        // slow는 애미네이션 속도. slow로 설정하면 부드럽게 스크롤 되는 효과가 적용됨.

    })


    //화면 맨 아래로 내려가게 하는 코드
    $("#up_btn").on('click', function () {
        var windowHeight = $(window).height();
        $('html, body').animate({ scrollTop: windowHeight }, 'slow');
        // 코드 해석
        // var windowHeight = $(window).height(); : 현재 브라우저 창의 높이를 구하여 windowHeight 변수에 저장 -> 브라우저 창의 높이 만큼 아래로 스크롤하도록 설정
        // $('html, body').animate({ scrollTop: windowHeight }, 'slow'); : scrollTop 속성을 이용하여 페이지의 스크롤 위치를 sindowHeight 변수의 값 만큼 아래로 이동
    })

    // 로봇 상담 페이지로 연결되는 코드
    $("#robot_btn").on('click', function () {
        // 로봇 상담 페이지와 연결해야함.
    })

})