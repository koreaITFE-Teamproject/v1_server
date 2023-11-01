$(document).ready(function () {
  // 썸머노트 내용 입력란 높이 = 브라우저 창 높이 - 288
  // ((메인,marginTop:143) - (layout,height:50) - (layout,marginBottom:10) - (noteToolbar,height:40) - (noteToolbar,paddingBottom:5)) -
  // (note-editable,padding:10 0) - (panel,paddingBottom:20) = 288
  var noteHeght = window.innerHeight - 288;

  $("#write").summernote({
    focus: true,
    lang: "ko-KR",
    placeholder: "내용을 작성하세요",
    width: "100%",
    height: noteHeght,
    toolbar: [
      // +툴바 직접 지정
      ["style", ["style"]], // 글자 스타일 설정
      ["fontname", ["fontname"]], // +글꼴 설정
      ["fontsize", ["fontsize"]], // +글꼴 크기 설정
      ["font", ["bold", "underline", "clear"]], // 글자 굵게, 밑줄, 포맷 제거
      ["color", ["color"]], // 글자 색상
      ["para", ["ul", "ol", "paragraph"]], // 문단 스타일, 순서 없는 목록, 순서 있는 목록
      ["table", ["table"]], // 테이블 삽입
      ["insert", ["link", "picture", "video"]], // 링크 삽입
    ],
    fontNames: [
      "Arial",
      "Arial Black",
      "Comic Sans MS",
      "Courier New",
      "맑은 고딕",
      "궁서",
      "굴림체",
      "굴림",
      "돋음체",
      "바탕체",
    ],
    fontSizes: [
      "8",
      "9",
      "10",
      "11",
      "12",
      "14",
      "16",
      "18",
      "20",
      "22",
      "24",
      "28",
      "30",
      "36",
      "50",
      "72",
    ],
  });

  $(".note-toolbar").css("height", "40px"); // 노트툴바 높이 40px 지정

  $(".note-statusbar").hide(); // 썸머노트 입력란의 높이 변경 못하도록 숨김

  $(window).on("resize", function () {
    // 브라우저 창 크기 변경될때 썸머노트 높이 변경
    noteHeght = window.innerHeight - 288; // 썸머노트 높이
    $(".note-editable").css("height", noteHeght);
  });

  $("#save-column").on("click", function () {
    if (confirm("게시하시겠습니까?")) {
      let sj = $("#sj").val();                    // 제목
      let nm = $(".nickname").text().trim();             // 작성자 닉네임
      let cn = $(".note-editable").html();        // 내용

      $.ajax({
        url: `http://localhost:3000/column/saveColumn`,
        method: "POST",
        data: { sj: sj, cn: cn, nm: nm },
        dataType: "json",
        success: function (data) {
          if (data.status == "SUCCESS") {
            alert("저장이 완료되었습니다.");
            window.location.href = "/column/all";
          }
        },
        error: function (err) {
          console.error("Error:", err);
        },
      });
    }
  });
});
