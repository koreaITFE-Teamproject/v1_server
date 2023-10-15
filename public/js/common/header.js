$(document).ready(function () {
    // 각 메뉴 항목에 대한 클릭 이벤트 리스너 추가
    $('.menu_bar_item').on('mouseenter', function () {
        $(this).find('.dropdown-content').css('display', 'block');
    });

    $('.menu_bar_item').on('mouseleave', function () {
        $(this).find('.dropdown-content').css('display', 'none');
    });


    // 브라우저 창 크기 변경될 때
    // 전체화면 상태가 아닐때 스크롤이 생기는데 이떄 내리면 헤더가 사라짐, 전체화면으로 바꿔도 헤더가 사라져 있어서 추가함
    $(window).on("resize", function () {
        $('header').removeClass('nav-up').addClass('nav-down');
    });

    // 헤더가 숨겨지거나 나타나는 동작을 구현하는 변수들
    var didScroll;
    var lastScrollTop = 0;
    var delta = 5; // 동작이 시작되는 위치
    var navbarHeight = $('header').outerHeight(); // 영향을 받을 요소를 선택

    // 스크롤시에 사용자가 스크롤했다는 것을 알림
    $(window).scroll(function(event) {
        didScroll = true;
    });

    // hasScrolled()를 실행하고 didScroll 상태를 재설정
    setInterval(function() {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);

    // 동작을 구현
    function hasScrolled() {
        // 현재 스크롤의 위치를 저장
        var st = $(this).scrollTop();

        // 설정한 delta 값보다 더 스크롤되었는지 확인
        if (Math.abs(lastScrollTop - st) <= delta) {
            return;
        }

        // 헤더의 높이보다 더 스크롤되었는지 확인하고 스크롤의 방향이 위인지 아래인지 확인
        if (st > lastScrollTop && st > navbarHeight) {
            // Scroll Down
            $('header').removeClass('nav-down').addClass('nav-up');
        } else {
            // Scroll Up
            if (st + $(window).height() < $(document).height()) {
                $('header').removeClass('nav-up').addClass('nav-down');
            }
        }

        // lastScrollTop에 현재 스크롤 위치를 지정
        lastScrollTop = st;
    }

    // 웹페이지의 스크롤을 내렸을 때를 감지해 코드를 실행하는 함수
    $(window).scroll(function() {
        if ($(window).scrollTop() == $(document).height() - $(window).height()) {
            // 실행할 함수
        }
    });
});
