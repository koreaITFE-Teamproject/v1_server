$(document).ready(function () {

  var currentPage = 1; // 현재 페이지 초기값

  var colType = $("#col-type").val();

  fetchPageData(currentPage, "", colType);

  // 페이지 데이터를 가져오는 함수
  function fetchPageData(page, searchQuery, columnType) {
    $("#postBody").text("");

    $.ajax({
      url: `http://localhost:3000/column/getList?page=${page}&search=${searchQuery}&type=${columnType}`,
      method: "GET",
      dataType: "json",
      success: function (data) {
        let resultData = data.data;
        console.log(resultData);
        if(resultData.length == 0){
          return $("#postBody").append(`<div class="none-column">해당 분야의 칼럼이 없습니다. 칼럼을 작성해주세요.</div>`)
        }

        for (var i = 0; i < resultData.length; i++) {

          // 내용 먼저 자르기, <> 태그로 감싸져 있으면 ''로 변환
          const content = truncateContent(resultData[i].cn.replace(/<[^>]*>/g, ''));

          $("#postBody").append(`
            <div class="column">
              <div class="column-top">
                <p class="column-no">${resultData[i].ROW_NUM}</p>
                <span></span>
                <p class="column-date">${resultData[i].WRITNG_TIME}</p>
                <span></span>
                <p class="column-hit">${resultData[i].hit} 읽음</p>
                <span></span>
                <p class="column-type">${resultData[i].COLMN_CL_NM}</p>
              </div>
              <div class="column-mid">
                <div class="column-info">
                  <p class="column-title"><a href="/column/read/${resultData[i].ROW_NUM}">${resultData[i].sj}</a></p>
                  <p class="column-content"><a href="/column/read/${resultData[i].ROW_NUM}">${content}</a></p>
                </div>
                <!-- 이미지 -->
                <a class="column-img-wrap" href="/column/read/${resultData[i].ROW_NUM}">
                <img class="column-img" src="${!resultData[i].cip ? 'http://placehold.it/130x130' : resultData[i].cip}" alt="---------------깃허브 푸시해야 보입니다!"></img>
                </a>
              </div>
              <div class="column-bot">
                <i class="fa-regular fa-thumbs-up"></i>
                <p class="column-like">${resultData[i].LIKE_COUNT}</p>
                <i class="fa-regular fa-comment-dots"></i>
                <p class="column-reply">${resultData[i].REPLY_COUNT}</p>
                <i class="fa-solid fa-circle-user"></i>
                <p class="column-nickname">${resultData[i].COLMN_WRTER}</p>
              </div>
            </div>
          `);
        }
        // 페이지 링크 업데이트
        updatePaginationUI(page, data.totalPages);

        $(".pagination-container").hide();


        let count = 0;
        let columns = $(".column").length;
        let time = 150;

        columns > 1 && columns <= 10 ? $("footer").hide() : $("footer").show();

        $("#postBody").css("height", `${208.5 * columns}`);

        var interval = setInterval(() => {

          $(".column").eq(count).css({
            "display": "grid",
            "-webkit-animation": "slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
            "animation": "slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both"
          });
          count++;
          if (count == columns + 1) {
            $(".pagination-container").css({
              "display": "flex",
              "-webkit-animation": "slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
              "animation": "slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both"
            });
          } else if (count == columns + 2) {
            clearInterval(interval);
            $("footer").show();
          }
        }, time);

      },
      error: function (err) {
        console.error("Error:", err);
      },
    });
  }

  // 페이지 링크를 업데이트하는 함수
  function updatePaginationUI(currentPage, totalPages) {
    var paginationContainer = $(".pagination-container");
    paginationContainer.empty(); // 이전 페이지 링크를 비우고 새로 생성

    var paginationList = $("<ul>").addClass("pagination");
    var prevPage = currentPage - 1;
    var nextPage = currentPage + 1;

    // "이전" 페이지 링크
    var prevItem = $("<li>").addClass("page-item");
    var prevLink = $("<a>")
      .addClass("page-link")
      .attr("href", "#")
      .text("이전");
    prevItem.append(prevLink);
    paginationList.append(prevItem);

    // 페이지 번호 링크
    for (var i = 1; i <= totalPages; i++) {
      var pageItem = $("<li>").addClass("page-item");
      var pageLink = $("<a>").addClass("page-link").attr("href", "#").text(i);

      // 현재 페이지 번호에 다른 배경색 추가
      if (i === currentPage) {
        pageItem.addClass("active");
      }

      pageItem.append(pageLink);
      paginationList.append(pageItem);
    }

    // "다음" 페이지 링크
    var nextItem = $("<li>").addClass("page-item");
    var nextLink = $("<a>")
      .addClass("page-link")
      .attr("href", "#")
      .text("다음");
    nextItem.append(nextLink);
    paginationList.append(nextItem);

    // 페이지 링크를 클릭할 때 해당 페이지 데이터 가져오기
    paginationList.find(".page-link").click(function (event) {
      $('html').scrollTop(0);

      $("header").removeClass("header nav-up");
      $("header").addClass("header nav-down");

      event.preventDefault();
      var searchQuery = $("#search-input").val();
      var columnType = $("#column_type").val() == '0' ? '' : $("#column_type").val();
      var clickedPage = parseInt($(this).text(), 10);

      if (!isNaN(clickedPage)) {
        fetchPageData(clickedPage, searchQuery, columnType);
      } else if ($(this).text() === "이전" && prevPage >= 1) {
        fetchPageData(prevPage, searchQuery, columnType);
      } else if ($(this).text() === "다음" && nextPage <= totalPages) {
        fetchPageData(nextPage, searchQuery, columnType);
      }
    });

    paginationContainer.append(paginationList);
  }

  $("#search-column").on("click", function () {
    var searchQuery = $("#search-input").val();
    var columnType = $("#column_type").val() == '0' ? '' : $("#column_type").val();

    // 검색어와 칼럼 타입을 이용하여 데이터를 가져오는 함수 호출
    fetchPageData(currentPage, searchQuery, columnType);
  });

  $("#search-input").add("#column_type").on("keypress", function (event) {
    if (event.which === 13) {
      event.preventDefault();

      $("#search-column").trigger("click");
    }
  });

  // 목록에 보여줄 내용 자르기, 기본 110글자
  function truncateContent(text) {
    let tempText = "";
    let max = 110;

    for (var i = 0; i < text.length; i++) {
      tempText += text[i];

      // 알파벳 소문자 길이가 한글에 비해 작기 때문에 알파벳 1개당 max + 0.5
      if (text.charCodeAt(i) >= 97 && text.charCodeAt(i) <= 122) {
        max += 0.5;
      }

      if (i >= max) {
        break;
      }
    }

    return tempText;
  }
});
