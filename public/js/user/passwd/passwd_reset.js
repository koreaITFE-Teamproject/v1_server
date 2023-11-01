$(document).ready(function () {

    let inputs = $(".name_input");

    const pwRegex = /^[A-Za-z0-9.,\/?!@#$%^&*]{10,30}$/;  // pw, [A~Z, a~z, 0~9, 특수문자(.,/?!@#$%^&*)] {글자수 10~30 사이}

    $(".validation-message").css("color", "red");

    $("#ck_button").click(function () {
        if (!confirm("비밀번호를 변경하시겠습니까?")) {
            return alert("취소합니다.");
        }

        let isProblem = false;                                  // 버튼 클릭시 문제가 없는지 확인용

        for (let i = 0; i < inputs.length; i++) {
            if (inputs[0].value === inputs[1].value && inputs[1].value.trim()) {          // 새 비밀번호가 기존 비밀번호와 같은지 체크
                $(".validation-message").eq(1).css("display", "grid");
                validMsg($(".validation-message").eq(1), 3);
                isProblem = true;
            }
            
            if(isExist && !inputs[1].value.trim()){
                $(".validation-message").eq(0).css("display", "grid");
                $(".validation-message").eq(0).text("이미 사용중인 비밀번호 입니다.");
                isProblem = true;
            }

            if (checkValidity(i)) {                             // 문제가 있을때(true 일때)
                isProblem = true;
            }
        }

        if (isProblem) {
            return alert("작성하신 부분을 다시 확인해주세요.");
        }
    });

    let isExist = false;
    $(".name_input").change(function () {
        if ($(this).parent().index() === 0) {
            existPw();
        }
    });

    // 유효성 검사 함수
    function checkValidity(idx) {
        let isProblem = true;
        if (!inputs[idx].value.trim()) {                                        // 공백체크
            validMsgCss($(".validation-message").eq(idx), 0, idx);
        } else if (isRegexValid(inputs[idx].value, idx)) {                      // 정규식 체크 문제 없을 때
            validMsgCss($(".validation-message").eq(idx), 1, idx);
            isProblem = false;
        } else {                                                                // 그외 문제 있을 떄
            validMsgCss($(".validation-message").eq(idx), 2, idx);
        }

        return isProblem;
    }

    function isRegexValid(input, idx) {
        switch (idx) {
            case 0:
                return 1;
            case 1:
                return pwRegex.test(input) ? 1 : 0;
            case 2:
                return input === inputs[idx - 1].value ? 1 : 0;
        }
    }

    // 유효메시지 CSS 적용 함수, (메시지, 메시지타입-> 0: 공백, 1: 문제없음, 2: 문제있음)
    function validMsgCss(msg, msgType, idx) {
        switch (msgType) {
            case 0:
                msg.css("display", "grid");
                msg.text("*빈칸을 채워주세요.");
                break;
            case 1:             // 문제 없을 때
                msg.text("");
                msg.hide();
                break;
            case 2:             // 문제 있을 때
                msg.css("display", "grid");
                validMsg(msg, idx);
                break;
        }
    }

    function validMsg(msg, idx) {
        switch (idx) {
            case 0:
                return;
            case 1:
                return msg.text("*길이제한: 10 ~ 30, 한글x, 특수문자 (.,/?!@#$%^&*) 허용");
            case 2:
                return msg.text("*비밀번호가 다릅니다.");
            case 3:
                return msg.text("*기존 비밀번호와 같습니다.");
        }
    }

    function existPw() {
        let data = {
            ncnm: $(".nickname").text().trim(),
            pw: inputs[0].value,
        }

        $.ajax({
            url: '/user/existPw',
            method: 'POST',
            data: data,
            dataType: 'json',
            success: function (data) {
                data.isExist ? isExist = true : isExist = false;
            },
            error: function (xhr, status, error) {
                console.log("에러: ", error);
            }
        });
    }
})