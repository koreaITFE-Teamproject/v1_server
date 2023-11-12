$(document).ready(function () {
    getContent();
    getReply();

    // db에서 컨텐츠 가져오는 작업
    function getContent() {
        const content = $("#getContent").val();
        $("#content").html(content);

        // 시작 시 내용부분 높이 지정
        const contentheight = parseFloat($(".column_contents").css("height")) + 80;
        $(".column_contents").css("height", contentheight);
    }

    // 댓글 입력 시 글자 수 제한
    var maxCharacterCount = 300;
    $('.reply_text').on('input', function () {
        var text = $(this).val();
        var currentCharacterCount = text.length;
        if (currentCharacterCount > maxCharacterCount) {
            $(this).val(text.slice(0, maxCharacterCount));
            currentCharacterCount = maxCharacterCount;
            $('.js_num').text(currentCharacterCount);
        }
        $('.js_num').text(currentCharacterCount);
    });

    // 좋아요 눌렀을때 숫자 오르게

    // 댓글 가져오기
    function getReply() {
            $("#input_text_bar").text("");

            // 칼럼 번호
            let colNo = $("#col_no").text().trim().replace(/\./g, '');

            $.ajax({
                url: `http://localhost:3000/column/getReply`,
                method: "POST",
                data: { colNo: colNo },
                dataType: "json",
                success: function (data) {
                    $(".reply_count").text(data.length);

                    for (var i = 0; i < data.length; i++) {
                        if (data[i].del == 1) {
                            $("#input_text_bar").append(`
                            <div id="reply"><span>${i + 1}. </span>삭제한 댓글입니다.</div>
                            <p>-----------------------------------------</p>
                        `)
                        } else {
                            $("#input_text_bar").append(`
                            <div id="reply">
                                <span>${i + 1}. </span>
                                <span>[${data[i].frst_reg_id}]</span>
                                <span>[${data[i].wt}]</span>
                                <div id="get_reply_text">- ${data[i].reply_cn}</div>
                            <p>-----------------------------------------</p>
                        `);
                        }
                    }
                },
                error: function (xhr, status, error) {
                    // 오류가 발생한 경우 처리합니다.
                    console.error("오류:", error);
                },
            });
        }

    // 댓글 입력
    $(".reply_save_btn").click(function () {
            if (!confirm("댓글을 등록하시겠습니까?")) {
                return alert("취소합니다.");
            }

            let colNo = $("#col_no").text().trim().replace(/\./g, '');
            let replyText = $(".reply_text").val().trim();

            if (!replyText) {
                $(".reply_text").val("");
                return alert("댓글을 입력하세요.");
            }

            const data = {
                colNo: colNo,
                replyText: replyText,
            }

            $.ajax({
                url: `http://localhost:3000/column/saveReply`,
                method: "POST",
                data: data,
                dataType: "json",
                success: function (data) {
                    $('.js_num').text("0");
                    $(".reply_text").val("");
                    getReply();
                },
                error: function (xhr, status, error) {
                    // 오류가 발생한 경우 처리합니다.
                    console.error("오류:", error);
                },
            });
        });

    // 댓글 줄바꿈이 원래 있나?
    // $(".reply_text").on("keypress", function (event) {
    //     if (event.which === 13) {
    //         event.preventDefault();

    //         $(".reply_save_btn").trigger("click");
    //     }
    // });


    $(".reply_text").click(function () {
        if (!!$(".reply_text").attr("readonly")) {
            if (confirm("로그인 후 이용해주세요.")) {
                window.location.href = '../../../user/login';
            }
        }
    });

})