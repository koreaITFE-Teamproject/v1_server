//요소 싸그리 다 수정해야함.

$(function () {
  // 테스트용 방 생성
  for (var i = 0; i < 10; i++) {
      $(".user-rooms-wrap").append(`<ul><li>${i + 1}</li><li>방이름${i + 1}</li><li>방장이름${i + 1}</li></ul>`)
  }

  $(".select-discussion-rooms li").click(function () {
      discussPath($(this).index(), $(this).text());;

      $(".select-discussion-rooms li").css({
          "fontWeight": "normal",
          "borderBottom": 0,
      });
      $(this).css({
          "fontWeight": "bold",
          "borderBottom": "2px solid #764127",
      });
  });

  discussPath(0, "전체 토론방");

  function discussPath(idx, $text) {
      var discuss = "#";
      var rooms = "#";

      var pathText = `<i class="fa-solid fa-house"></i> > <a href='${discuss}'>토론방</a> > ${$text}`;
      if (idx == 0) {
          discuss = "#";
      } else if (idx == 1) {
          discuss = "#";
      } else {
          discuss = "#";
      }

      $(".path").html(pathText);
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