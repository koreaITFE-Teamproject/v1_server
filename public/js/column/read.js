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

    getLikes();

    $(".icon").on('click', function () {
        updateLikes();
    });

    function getLikes() {
        $.ajax({
            type: 'POST',
            url: `http://localhost:3000/column/getLikeColumn`,
            data: { columnId: $("#colNo").val() },
            success: function (data) {
                $(".like_count").text(data.like_count);
                if (data.user_nm != undefined) {
                    $("#icon").removeClass();
                    $("#icon").addClass("trueIcon");
                } else {
                    $("#icon").removeClass();
                    $("#icon").addClass("icon");
                }
            },
            error: function (error) {
                console.error('Error updating like status:', error);
            }
        });
    }

    // 업데이트
    function updateLikes() {
        let alreadyLiked = false;

        console.log($("#icon").hasClass("trueIcon"));

        // 이미 추천중일 때
        if ($("#icon").hasClass("trueIcon")) {
            alreadyLiked = true;
        }

        $.ajax({
            type: 'POST',
            url: `http://localhost:3000/column/updateLikeColumn`,
            data: { columnId: $("#colNo").val(), alreadyLiked: alreadyLiked },
            success: function (data) {
                getLikes();
            },
            error: function (error) {
                console.error('Error updating like status:', error);
            }
        });
    }

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
                console.log(data);

                $(".reply_count").text(data.length);


                for (var i = 0; i < data.length; i++) {
                    if (data[i].del == 1) {
                        $("#input_text_bar").append(` 
                        <div class="reply" replyNo="${i}" style="height:78px;"><span></span></span>삭제된 댓글입니다.</div>
                    `)
                    } else {
                        $("#input_text_bar").append(`
                        <div class="reply" replyNo="${i}">
                            <i class="fa-regular fa-circle-user"></i>
                            <div>
                                <div class="reply_write_info">
                                    <span>${data[i].frst_reg_id}</span>
                                    <div class="reply_sc_line">
                                        <span>${data[i].wt}</span>
                                        <input type="hidden" value="${data[i].reply_id}">
                                        ${data[i].frst_reg_no != $("#tmpeUsNo").val() ? "" : `<button type="button" class="btn btn-danger"><i class="fa-regular fa-trash-can" style="color: #ffffff;"></i></button>
                                        <button type="button" class="btn btn-success"><i class="fa-regular fa-pen-to-square" style="color: #ffffff;"></i></button>`}
                                    </div>
                                </div>
                                <div class="get_reply_text">${data[i].reply_cn}</div>
                            </div>
                            ${data[i].frst_reg_no != $("#tmpeUsNo").val() ? "" : '<input class="reply_modify" type="hidden" value="' + data[i].reply_cn + '" maxLength="300" replyId="' + data[i].reply_id + '"><button type="button" class="btn btn-primary">저장</button>'}
                        </div>
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

    // 댓글 수정
    let replyNo = 0;
    let replyId = 0;
    $(document).on('click', '.btn-success', function (e) {
        replyNo = parseInt($(e.target).parent().parent().parent().parent().parent().attr("replyNo"));
        $(`.reply:nth-child(${replyNo + 1})`).children().eq(2).attr("type", "text");
        $(`.reply:nth-child(${replyNo + 1})`).children().eq(3).show();
    });

    $(document).on('click', '.btn-primary', function (e) {
        let replyModifyText = $(e.target).prev().val();
        replyId = $(e.target).prev().attr("replyId");
        replyMod(replyModifyText);
    });

    // 댓글 수정
    function replyMod(rmt) {
        if (!confirm("댓글을 수정하시겠습니까?")) {
            return alert("취소합니다.");
        }

        if(!rmt){
            return alert("댓글을 입력해주세요.");
        }

        $.ajax({
            url: `http://localhost:3000/column/modReply`,
            method: "POST",
            data: { replyModifyText: rmt, replyId: replyId },
            dataType: "json",
            success: function (data) {
                getReply();
                alert("수정이 완료되었습니다.");
            },
            error: function (xhr, status, error) {
                // 오류가 발생한 경우 처리합니다.
                console.error("오류:", error);
            },
        });
    }

    // 댓글 삭제
    $(document).on('click', '.btn-danger', function (e) {
        if (!confirm("댓글을 삭제하시겠습니까?")) {
            return alert("취소합니다.");
        }
        replyId = $(e.target).parent().prev().val();
        replyDel(replyId)
    });

    function replyDel(replyId) {
        $.ajax({
            url: `http://localhost:3000/column/delReply`,
            method: "POST",
            data: { replyId: replyId },
            dataType: "json",
            success: function (data) {
                getReply();
                alert("삭제되었습니다.");
            },
            error: function (xhr, status, error) {
                // 오류가 발생한 경우 처리합니다.
                console.error("오류:", error);
            },
        });
    }

    $(".reply_text").click(function () {
        if (!!$(".reply_text").attr("readonly")) {
            if (confirm("로그인 후 이용해주세요.")) {
                window.location.href = '../../../user/login';
            }
        }
    });

})