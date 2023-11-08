$(document).ready(function () {
  // 썸머노트 textarea 높이 = 브라우저 창 높이 - 368
  // ((메인,marginTop:143) - (layout,height:50) - (layout,marginBottom:10) - (noteToolbar,height:40) - (noteToolbar,paddingBottom:5)) -
  // (note-editable,padding:10 0) - (panel,paddingBottom:20) - (footer,height:80) = -368
  var noteHeght = window.innerHeight - 368;

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
      // ['view', ['codeview', 'fullscreen', 'help']]  // 코드 보기
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

  $(".note-statusbar").hide(); // 썸머노트 textarea 높이 변경 못하도록 숨김

  $(window).on("resize", function () {
    // 브라우저 창 크기 변경될때 썸머노트 높이 변경
    noteHeght = window.innerHeight - 368; // 썸머노트 높이
    $(".note-editable").css("height", noteHeght);
  });

  // footer flex 지정, 칼럼 작성부분에서 footer flex가 안되어있음
  $("footer").css("display", "flex");


  let imgFilename = "";
  let uploadMsg = $("#uploadMsg");
  let isClicked = false;

  // 이미지 저장 버튼
  $("#uploadBtn").click(function () {
    uploadImgFile();
  });

  // 이미지 업로드 함수
  function uploadImgFile() {
    isClicked = false;
    var fileInput = $("#imgFile");
    var file = fileInput[0].files[0];

    if (file) {
      var formData = new FormData();
      formData.append('imgFile', file);

      // 이미지 폴더에 저장
      $.ajax({
        url: `http://localhost:3000/column/uploadImg`,
        method: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (filename) {
          imgFilename = filename.fn;
          // 업로드가 성공하면 서버의 응답 데이터를 처리합니다.
          uploadMsg.text("이미지 업로드 및 저장 완료");
          setImg(filename.imgPath);
        },
        error: function (xhr, status, error) {
          // 오류가 발생한 경우 처리합니다.
          console.error("파일 업로드 오류:", error);
        },
      });
    } else {
      uploadMsg.text("선택된 이미지 파일이 없습니다.");
    }
  }


  // 이미지 삭제 버튼
  $("#imgDelBtn").click(function () {
    deleteImgFile();
  });

  // 이미지 삭제 함수
  function deleteImgFile() {
    isClicked = false;
    console.log(imgFilename);
    $.ajax({
      url: `http://localhost:3000/column/deleteImg`,
      method: "POST",
      data: { imgFn: imgFilename },
      dataType: "json",
      success: function (data) {
        uploadMsg.text(data.msg);
        imgFilename = "";
        setImg(imgFilename);
      },
      error: function (xhr, status, error) {
        // 오류가 발생한 경우 처리합니다.
        console.error("이미지 삭제 오류:", error);
      },
    });
  }


  // 이미지 미리보기 기능
  $(".fa-image").add(".fa-sort-down").click(function () {
    if (!isClicked || isClicked) {
      isClicked = !isClicked
      let imgHt = parseFloat($("#uploadImg").css("width")) <= 900 ? 350 : 450;
      !isClicked ? $("#uploadImg").attr("hidden", true) : $("#uploadImg").removeAttr("hidden");
      $("#uploadImg").css("height", imgHt);
    }
  });

  // 이미지 있는지 확인
  function setImg(fnip) {
    console.log(fnip);
    let isEmpty = !fnip ? false : true;
    imgFilename = fnip;
    $("#uploadImg").prop("src", fnip);
    $("#imgFile").prop("disabled", isEmpty);
    $("#uploadBtn").prop("disabled", isEmpty);
    $("#img-preview>div").css("display", `${!isEmpty ? 'none' : 'flex'}`);   // 미리보기 기능
  }


  // 게시 버튼
  $("#save-column").on("click", function () {
    if ($("#column_type").val() == 0) {
      return alert("칼럼 유형을 선택해주세요.");
    }

    if (confirm("게시하시겠습니까?")) {
      // 게시글 db에 저장
      let sj = $("#sj").val();                    // 제목
      let cn = $(".note-editable").html();        // 내용
      let ct = $("#column_type").val();           // 칼럼 타입
      let nm = $(".nickname").text().trim();      // 작성자 닉네임

      $.ajax({
        url: `http://localhost:3000/column/saveColumn`,
        method: "POST",
        data: { sj: sj, cn: cn, ct: ct, nm: nm },
        dataType: "json",
        success: function (data) {
          if (data.status == "SUCCESS") {
            alert("게시되었습니다.");
            window.location.href = "/column/all";
          }
        },
        error: function (err) {
          console.error("Error:", err);
        },
      });
    }
  });


  // 수정 시 내용 넣기
  getContent();
  function getContent() {
    !$("#img-path").val() ? '' : setImg($("#img-path").val());

    const content = $("#content").val()
    $(".note-placeholder").hide();
    $(".note-editable").html(content);
  }

  // 수정 버튼
  $("#update-column").on("click", function () {
    if ($("#column_type").val() == 0) {
      return alert("칼럼 유형을 선택해주세요.");
    }

    if (confirm("수정하시겠습니까?")) {
      let sj = $("#sj").val();                    // 제목
      let cn = $(".note-editable").html();        // 내용
      let ct = $("#column_type").val();           // 칼럼 타입
      let colNo = $("#col_no").val();             // 칼럼 번호
      let imgFn = imgFilename;                    // 이미지 경로

      $.ajax({
        url: `http://localhost:3000/column/update`,
        method: "POST",
        data: { sj: sj, cn: cn, ct: ct, imgFn: imgFn, colNo: colNo },
        dataType: "json",
        success: function (data) {
          if (data.status == "SUCCESS") {
            alert("수정되었습니다.");
            window.location.href = `/column/read/${colNo}`;
          }
        },
        error: function (err) {
          console.error("Error:", err);
        },
      });
    }
  });
});
