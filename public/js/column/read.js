$(document).ready(function () {
    getContent();

    // db에서 컨텐츠 가져오는 작업
    function getContent() {
        const content = $("#getContent").val();
        $("#content").html(content);

        // 시작 시 내용부분 높이 지정
        const contentheight = parseFloat($(".column_contents").css("height")) + 80;
        $(".column_contents").css("height", contentheight);
    }

    // 현재 댓글 다는부분 구분 안되고 둘다 들어감. 백 들어오면 구분 되게 해야함.
    var bodyTextarea = $('.textarea');
    var characterCountDisplay = $('.js_num');
    var maxCharacterCount = 300;

    bodyTextarea.on('input', function () {
        var text = bodyTextarea.val();
        var currentCharacterCount = text.length;

        if (currentCharacterCount > maxCharacterCount) {
            bodyTextarea.val(text.slice(0, maxCharacterCount));
            currentCharacterCount = maxCharacterCount;
        }
        characterCountDisplay.text(currentCharacterCount);
    });

    // 좋아요 눌렀을때 숫자 오르게

})