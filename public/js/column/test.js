$(document).ready(function () {
  var currentPage = 1; // 현재 페이지 초기값

  fetchPageData(currentPage, "");

  // 페이지 데이터를 가져오는 함수
  function fetchPageData(page, searchQuery) {
    $("#postBody").text("");

    $.ajax({
      url: `http://localhost:3000/user/getList?page=${page}&search=${searchQuery}`,
      method: "GET",
      dataType: "json",
      success: function (data) {
        let resultData = data.data;
        console.log(resultData);
        for (var i = 0; i < resultData.length; i++) {
          console.log(resultData[i]);
          var postBody = $("#postBody");
          var postBodyData = "<tr>";
          postBodyData += `<td>${resultData[i].ROW_NUM}</td>`;
          postBodyData += `<td>${resultData[i].SJ}</td>`;
          postBodyData += `<td>${resultData[i].COLMN_WRTER}</td>`;
          postBodyData += `<td>${resultData[i].WRITNG_TIME}</td>`;
          postBodyData += "</tr>";
          postBody.append(postBodyData);
        }

        // 페이지 링크 업데이트
        updatePaginationUI(page, data.totalPages);
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
      event.preventDefault();
      var searchQuery = $("#search-input").val();

      var clickedPage = parseInt($(this).text(), 10);
      if (!isNaN(clickedPage)) {
        fetchPageData(clickedPage, searchQuery);
      } else if ($(this).text() === "이전" && prevPage >= 1) {
        fetchPageData(prevPage, searchQuery);
      } else if ($(this).text() === "다음" && nextPage <= totalPages) {
        fetchPageData(nextPage, searchQuery);
      }
    });

    paginationContainer.append(paginationList);
  }

  $("#search-column").on("click", function () {
    var searchQuery = $("#search-input").val();

    // 검색어를 이용하여 데이터를 가져오는 함수 호출
    fetchPageData(currentPage, searchQuery);
  });

  $("#search-input").on("keypress", function (event) {
    if (event.which === 13) {
      event.preventDefault();

      $("#search-column").trigger("click");
    }
  });

  $("#add-column-btn").on("click", function () {
    window.location.href = "/user/write_column";
  });
});
