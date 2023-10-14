// 3.이메일 글자 20자 제약? 이메일도 제약을 하나? : 구글링은 이메일 정규 표현식이라는게 있기는 한데.
// 반복 부분 함수로 빼기
// 1. 공백 입력 방지

$(document).ready(function () {
    // 함수로 중복 코드 추상화
    function checkInput(selector, maxLength) {
        $(selector).on('input', function () {
            var input = $(this).val()
            if (input.length >= maxLength) {
                $(this).val(input.substring(0, maxLength));
                // 넘어가면 input 아래에 길이 제한 메시지 띄우기
                $(this).siblings('.validation-message').text('최대 길이 ' + maxLength + '자를 초과할 수 없습니다.');
            } else {
                $(this).siblings('.validation-message').text('');
            }
            // 공백 입력 방지
            if (/\s/.test(input)) {
                alert('공백을 입력할 수 없습니다.');
                $(this).val(input.replace(/\s/g, ''));
            }
        });
    }

    // 이름 입력란 제약사항 체크
    checkInput('#name_input', 10);

    // 아이디 입력란 제약사항 체크
    checkInput('#id_input', 15);

    // 인증번호 입력란 제약사항 체크
    checkInput('#ck_num_input', 6);

    // 5. 확인 눌렀을 때 글자 수 확인
    $('#ck_button').click(function () {
        // 이름 부분
        var name = $('#name_input').val();
        if (name.length < 2) {
            alert('이름은 최소 2자 이상이어야 합니다.');
            return; // 글자 수가 부족한 경우 코드를 더 실행하지 않도록 return
        }

        // 아이디 부분
        var id = $('#id_input').val();
        if (id.length < 10) {
            alert('아이디는 10자 이상이어야 합니다.');
            return; // 글자 수가 부족한 경우 코드를 더 실행하지 않도록 return
        }
        // 이하 부분은 확인 버튼이 클릭되었을 때 수행할 코드
        alert('확인을 클릭하셨습니다.');
    });

    // 6. 마우스 올리면 마우스 모양 변경되고 클릭하면 클릭되는 코드
    $('#ck_num').mouseover(function () {
        $(this).css('cursor', 'pointer');
    });

    // "확인" 요소에 마우스 오버 시 커서 모양 변경
    $('#ck_button').mouseover(function () {
        $(this).css('cursor', 'pointer');
    });

    // "인증번호 확인" 클릭 시 알림창 띄우기
    $('#ck_num_box').click(function () {
        alert('인증번호 확인을 클릭하셨습니다.');
        //DB 연결하고 나면 인증번호가 틀리면 틀렸다고 뜨고 맞으면 맞았다고 뜨게 수정
    });

    // 이메일 체크 (직접입력일때)
    var userEmail;
    $(".custom-input").hide();
    $("#select-email-option").change(function () {
        if ($(this).val() == "userInput") {
            $(".custom-input").show();
        } else {
            $(".custom-input").hide();
            $(".custom-input").val("");
            userEmail = `${$(".user-email-input").val()}@${$(this).val()}`;
        }
    });

    $(".custom-input").change(function () {
        userEmail = `${$(".user-email-input").val()}@${$(".custom-input").val()}`;
    });

})