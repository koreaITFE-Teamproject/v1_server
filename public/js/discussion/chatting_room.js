$(document).ready(function () {

    // 창 크기가 변경될 때 이벤트 처리
    $(window).on("resize", function () {
        setScreenHeight();
    });

    // 입력 버튼 클릭(마우스) 이벤트 처리
    $('.enter_btn').on('click', handleInput);

    // Enter 키 눌렀을 때 이벤트 처리
    $('#chat_input').on('keyup', function (event) {
        if (event.key === 'Enter') {
            handleInput();
        }
    });

    // 채팅 메시지 추가 함수
    function addChatMessage(message) {
        const chatMessage = `
            <div class="chat chat-end">
              <div class="chat-header">닉네임1 <time class="text-xs opacity-50">Just now</time></div>
              <div class="chat-bubble">${message}</div>
            </div>
          `;
        $('.chat_screen').append(chatMessage);
        setScreenHeight();
    }

    // 입력 처리 함수
    function handleInput() {
        const message = $('#chat_input').val();
        if (message.trim() !== '') {
            addChatMessage(message);
            $('#chat_input').val('');
        }
    }

    // 스크린 높이 설정하는 함수
    function setScreenHeight() {
        var inputHeight = parseFloat($(".input_div").css("height"));
        var roomHeadHeight = parseFloat($(".room-head").css("height"));
        // screenHeight = 창 높이 - (헤더높이 + 마진) - textarea높이 - room-head높이 - 3
        var screenHeight = window.innerHeight - 160 - inputHeight - roomHeadHeight - 3;
        $(".chat_screen").css({ "height": screenHeight });
    }
});