$(document).ready(function () {
    // 초기에 검색 결과를 숨김
    hideSearchResults();

    // x 마우스 모양 변경
    setCursorPointer("#x_icon");
    // x 누름
    $("#x_icon").on('click', function () {
        alert("x를 눌렀습니다.") // 메인페이지로 이동하는 것으로 변경해야 함.
    });

    // search 마우스 모양 변경
    setCursorPointer("#search_icon");

    // Enter 키 누를 때 검색 실행
    $('#search_input').on('keyup', function (e) {
        if (e.key === "Enter") {
            performSearch();
        }
    });

    // 검색 아이콘이 클릭되었을 때 검색 결과를 보이게 함.
    $('#search_icon').on('click', function () {
        // 검색 결과를 초기화하고 새로운 검색을 수행하는 함수 호출
        performSearch();
    });
});

// 검색 결과를 숨기는 함수
function hideSearchResults() {
    $('.search_results').hide();
}

// 마우스 모양을 포인터로 변경하는 함수
function setCursorPointer(selector) {
    $(selector).mouseover(function () {
        $(this).css('cursor', 'pointer');
    });
}

// 테스트 데이터
var searchResults = [
    { no: 1, title: '검색 결과 1', writer: '작성자 1' },
    { no: 2, title: '검색 결과 2', writer: '작성자 2' },
    { no: 3, title: '검색 결과 3', writer: '작성자 3' },
];

// 검색 결과를 초기화하고 새로운 검색을 수행하는 함수
function performSearch() {
    // 검색 결과를 숨김
    hideSearchResults();

    // 여기에서 검색 결과를 가져와서 처리하고, 결과를 표에 표시하도록 수정해야 합니다.
    var inputVal = $('#search_input').val(); // 입력된 검색어 가져오기
    var tbody = $('#postBody');
    tbody.empty(); // 이전 검색 결과를 지우고 새로운 결과로 대체합니다.

    // 검색 결과를 표시합니다.
    for (var i = 0; i < searchResults.length; i++) {
        if (inputVal == searchResults[i].no) { // 입력된 검색어와 no 값 비교
            var result = searchResults[i];
            var row = '<tr><td>' + result.no + '</td><td>' + result.title + '</td><td>' + result.writer + '</td></tr>';
            tbody.append(row);
        }
    }

    // 검색 결과를 표시합니다.
    $('.search_results').show();
}