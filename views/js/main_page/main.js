$(document).ready(function () {
    // 클릭했을때 작동 하는지 확인하기 위해 만든 script 페이지 필요 없으면 없애도 됩니다.
    $(".bar_item, .class_item").on("click", function () {
        alert($(this).text() + " 클릭");                                                // 임의 값
    });


    var carouselIdx = 0;                                                                // 각 캐러셀의 인덱스
    var indicatorsIdx = [0, 0, 0];                                                      // 각 슬라이드의 지표 인덱스, 각 슬라이드 위치

    // bwWidth = 창길이 - (창길이 - .recomm_outline의 길이)     // 각 유저가 사용하는 브라우저의 길이
    bwWidth = window.innerWidth - (window.innerWidth - parseFloat($(".recomm_outline").css("width")));   // 브라우저 길이
    var currentSlideWidth = 0;                                                          // 움직인 슬라이드의 길이를 저장하기위한 변수 선언
    var slide;                                                                          // .slide_bar 를 담기 위한 변수 선언

    setIndicatorsLabelCss();                                                            // 홈페이지 시작 시 슬라이드 색 변경
    showBtn();                                                                          // 홈페이지 시작 시 버튼 보이기, 숨기기


    /* 이전 버튼 클릭 시 */
    $(".bi-chevron-left").click(function () {
        slide = $(this).next().next();                                                  // 클릭한 버튼의 형제인 슬라이드 요소
        carouselIdx = $(this).parent().prev().prev().val();                             // 해당 캐러셀의 인덱스

        // 해당 캐러셀의 슬라이드의 인덱스가 0 초과일 떄
        if (indicatorsIdx[carouselIdx] > 0) {
            currentSlideWidth = bwWidth * indicatorsIdx[carouselIdx]-- - bwWidth;       // 현재 슬라이드 길이
            slide.css("transform", `translate3d(-${currentSlideWidth}px, 0, 0)`);
            setIndicatorsLabelCss();                                                    // 슬라이드 지표 색 변경 함수 호출
        }

        radioCheck($(this).parent().children(".slide-indicators"));                     // radio 체크함수 호출, 인수(슬라이드 지표)
        showBtn();                                                                      // showBtn 함수 호출
    });


    /* 다음 버튼 클릭 시 */
    $(".bi-chevron-right").click(function () {
        slide = $(this).next();                                                         // 클릭한 버튼의 형제인 슬라이드 요소
        carouselIdx = $(this).parent().prev().prev().val();                             // 해당 캐러셀의 인덱스

        // 해당 캐러셀의 슬라이드의 인덱스가 2 미만일 떄
        if (indicatorsIdx[carouselIdx] < 2) {
            currentSlideWidth = bwWidth * (indicatorsIdx[carouselIdx]++ + 1);           // 현재 슬라이드 길이
            slide.css("transform", `translate3d(-${currentSlideWidth}px, 0, 0)`);
            setIndicatorsLabelCss();                                                    // 슬라이드 지표 색 변경 함수 호출
        }

        radioCheck($(this).parent().children(".slide-indicators"));                     // radio 체크함수 호출, 인수(슬라이드 지표)
        showBtn();                                                                      // showBtn 함수 호출
    });


    /* 라디오 체크 함수,    이전, 다음 버튼 클릭 시 해당 라디오 체크 */
    function radioCheck($this) {
        radios = $this.children();                                                      // 매개변수로 받은 슬라이드 지표의 자식들을 저장
        radios.each(function (idx, item) {                                              // 자식의 수 만큼 each문으로 반복
            $(item).children().prop("checked", false);                                  // 각 자식의 radio를 체크 해제
        });
        $this.children().children().eq(indicatorsIdx[carouselIdx]).prop("checked", true);    // 클릭 된 슬라이드의 클릭 한 인덱스 위치의 radio만 체크
    }


    /*  슬라이드 지표 클릭 시 */
    $(".slide-indicators .indicators-radio").click(function () {
        carouselIdx = $(this).parents(".carousel-wrapper").prev().prev().val();         // 해당 슬라이드의 인덱스 (캐러셀 인덱스)
        var indicatorIdx = $(this).parent().index();                                    // 각 슬라이드 지표의 부모의 인덱스 (라벨 인덱스)
        indicatorsIdx[carouselIdx] = indicatorIdx;                                      // 캐러셀 슬라이드 배열[캐러셀 인덱스] = 라벨 인덱스;
        setIndicatorLabelCss($(this).parent().parent(), carouselIdx);                   // setIndicatorLabelCss 함수 호출, 인수(.slide-indicators, carouselIdx)
        setSlideBarWidth($(this).parent().parent().prev(), carouselIdx);                // setSlideBarWidth 함수 호출, 인수(.slide_bar, carouselIdx)
        showBtn();
    });


    /* 슬라이드 지표 색 변경 함수 (복수) */
    function setIndicatorsLabelCss() {
        $(".slide-indicators").each(function (idx) {                                    // each문으로 반복, 시작 시에만 호출
            setIndicatorLabelCss($(this), idx);                                         // 클릭한 슬라이드의 지표만 색상 변경
        });
    }


    /* 슬라이드 지표 색 변경 함수 (단수) */
    function setIndicatorLabelCss($this, idx) {                                         // 슬라이드 클릭 시에만 동작
        $this.children().css("backgroundColor", "#F6E3CE");
        $this.children().eq(indicatorsIdx[idx]).css("backgroundColor", "#764127");
    }


    /* 슬라이드바 이동 함수 */
    function setSlideBarWidth($this, idx) {
        bwWidth = window.innerWidth - (window.innerWidth - parseFloat($(".recomm_outline").css("width")));   // 현재 브라우저의 길이값 다시 저장
        currentSlideWidth = bwWidth * (indicatorsIdx[idx]);                             // 현재의 인덱스에서 브라우저의 길이가 변할 때 길이가 깨지는거 방지용               
        $this.css("transform", `translate3d(-${currentSlideWidth}px, 0, 0)`);
    }


    /* 브라우저 창의 크기가 변경 될 시 */
    $(window).on("resize", function () {
        $(".slide_bar").each(function (idx) {                                           // each문으로 반복, 각각의 슬라이드바 길이 적용
            setSlideBarWidth($(this), idx);                                             // setSlideBarWidth 함수 호출, 인수(각 슬라이드바, idx)
        });
    });


    /* 버튼 각 끝에 위치할떄 보이기, 숨기기 */
    function showBtn() {
        $(indicatorsIdx).each(function (idx, item) {                                    // 캐러셀 슬라이드 인덱스 배열 each문
            var prevBtn = $(`.recomm_outline>input[value=${idx}]`).next().next().children().first();    // 이전 버튼
            var nextBtn = $(`.recomm_outline>input[value=${idx}]`).next().next().children().eq(1);      // 다음 버튼

            prevBtn.show();                                                             // 이전 버튼 보이기
            nextBtn.show();                                                             // 다음 버튼 보이기

            if (item == 0) {                                                            // 해당 요소의 값이 0일 때 이전 버튼 숨김
                return prevBtn.hide();
            }
            if (item == 2) {                                                            // 해당 요소의 값이 2일 때 다음 버튼 숨김
                return nextBtn.hide();
            }
        });
    }
});
