$(function () {
    // 테스트용 방 생성

    for (var i = 0; i < 15; i++) {
        var rand = Math.round(Math.random() * 8);
        $(".user-rooms-wrap").append(
            `
            <div class="room">
                <div class="room-explain">
                    <p class="room-name">안녕하세요. 테스트 방입니다.${i + 1}</p>
                    <p class="intro">안녕하세요. 같이 토론해요. 테스트 소개글입니다.</p>
                    <div class="room-bottom-wrap">
                        <i class="fa-solid fa-user"></i>
                        <p class="headcount">${rand}명</p>
                        <span>•</span>
                        <p class="moderator">성훈${i}</p>
                    </div>
                </div>
                <div class="room-img">
                    <img src="http://placehold.it/120x120" alt=""></img>
                </div>
            </div>
            `
        )
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
    
});