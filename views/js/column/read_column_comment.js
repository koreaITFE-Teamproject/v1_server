$(document).ready(function () {
    // 현재 댓글 다는부분 구분 안되고 둘다 들어감. 백 들어오면 구분 되게 해야함.
    var bodyTextarea= $('.textarea');
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

    // 좋아요와 구독 눌렀을때 기능
    var heart = $('.bi-heart');
    var bell = $('.bi-bell');

    
    heart.on('click', function () {
        if (heart.hasClass('bi-heart')) {
            heart.removeClass('bi-heart').addClass('bi-heart-fill');
        } else {
            heart.removeClass('bi-heart-fill').addClass('bi-heart');
        }
    });

    bell.on('click', function () {
        if (bell.hasClass('bi-bell')) {
            bell.removeClass('bi-bell').addClass('bi-bell-fill');
        } else {
            bell.removeClass('bi-bell-fill').addClass('bi-bell');
        }
    });
})