$(document).ready(function () {
    var bodyTextarea = $('.content_input');
    var characterCountDisplay = $('.textCount');
    var maxCharacterCount = 1000;

    var title = $('.div_input');
    var check = $('#check');

    bodyTextarea.on('input', function () {
        var text = bodyTextarea.val();
        var currentCharacterCount = text.length;

        if (currentCharacterCount > maxCharacterCount) {
            bodyTextarea.val(text.slice(0, maxCharacterCount));
            currentCharacterCount = maxCharacterCount;
        }
        characterCountDisplay.text(currentCharacterCount);
    });

    title.on('input', function () {
        var text = title.val();
        var currentCharacterCount = text.length;

        if (currentCharacterCount > 50) {
            title.val(text.slice(0, 50)); // 길이가 50을 넘으면 처음 50글자까지만 유지
            currentCharacterCount = 50;
        }
    });

    check.on('click', function () {
        var text = title.val();
        var content = bodyTextarea.val();
        var title_length = text.trim().length;
        var content_length = content.trim().length;

        if (title_length === 0 || content_length === 0) {
            alert('제목과 내용을 입력해주세요.')
        }
    });

});