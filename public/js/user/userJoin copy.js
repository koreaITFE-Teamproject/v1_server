$(function () {
    let requiredInputs = $(".user-input");                          // 필수기입항목 input
    console.log(requiredInputs);
    let isCheckDuplicate = [false, false];                          // 중복확인 했는지 배열, [아이디, 닉네임]
    var userEmail = "";      // 이메일

    // 정규표현식
    const idRegex = /^[A-Za-z0-9]{7,20}$/;                // id, [A~Z, a~z, 0~9] {글자수 7~20 사이}
    const pwRegex = /^[A-Za-z0-9.,\/?!@#$%^&*]{10,30}$/;  // pw, [A~Z, a~z, 0~9, 특수문자(.,/?!@#$%^&*)] {글자수 10~30 사이}
    const nameRegex = /^[가-힣A-Za-z]{2,10}$/;            // name, [한글(가~힣), A~Z, a~z] {글자수 2~10 사이}
    const nicknameRegex = /^[가-힣A-Za-z0-9]{2,15}$/;     // nickname, [한글(가~힣), A~Z, a~z, 0~9] {글자수 2~15 사이}
    const emailRegex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;     // 이메일 형식 확인
    // const pnRegex = /^[0-9]{3}-[0-9]{4}-[0-9]{4}$/       // pn, ooo-oooo-oooo 형태와 일치해야함 (숫자로만 구성)



    // 각 인풋값이 변할 시
    $(".user-input").change(function () {
        checkValidity($(this).parent().parent().index());
    });

    // 회원가입 버튼 클릭 시 필수기입 목록 작성했는지
    $("#user-join-btn").click(function () {
        if (!confirm("가입하시겠습니까?")) {
            return alert("취소합니다.");
        }

        let isProblem = false;                                  // 버튼 클릭시 문제가 없는지 확인용

        for (let i = 0; i < requiredInputs.length; i++) {
            if (checkValidity(i)) {                             // 문제가 있을때(true 일때)
                isProblem = true;
            }
        }

        // 유효성 검사 한개라도 실패 시
        if (isProblem) {
            isCheckDuplicate = [false, false];
            return alert("작성하신 부분을 다시 확인해주세요.");
        }

        // 전체 유효성 검사 성공 시 중복 검사
        for (let i = 0; i < isCheckDuplicate.length; i++) {
            if (!isCheckDuplicate[i]) {                         // 중복검사 한개라도 안했을 때, 둘다 초기화
                validMsgCss($(".validation-message").eq(0), 5, 0);
                validMsgCss($(".validation-message").eq(4), 5, 0);
                isCheckDuplicate = [false, false];
                isProblem = true;
                return alert("중복검사를 해주세요.");
            }
        }

        alert("가입되었습니다");
        $("form").submit();
    });

    // 중복확인 버튼 클릭 시
    $(".duplicate-btn").click(function () {
        const btnIdx = parseInt($(this).attr("data-btn-idx"));
        if (checkValidity(btnIdx)) {                                            // 유효성 검사 실패시
            return;
        }
        checkDuplicate(requiredInputs[btnIdx].value, btnIdx);
    });

    // 유효성 검사 함수
    function checkValidity(idx) {
        isProblem = true;
        if (!requiredInputs[idx].value.trim()) {                            // 공백체크
            validMsgCss($(".validation-message").eq(idx), 0, idx);
        } else if (isRegexValid(requiredInputs[idx].value, idx)) {          // 정규식 체크 문제 없을 때
            validMsgCss($(".validation-message").eq(idx), 1, idx);
            isProblem = false;
        } else {                                                            // 그외 문제 있을 떄
            validMsgCss($(".validation-message").eq(idx), 2, idx);
        }
        return isProblem;
    }

    // 정규식 검사 함수
    function isRegexValid(input, idx) {
        switch (idx) {
            case 0:
                return idRegex.test(input) ? 1 : 0;
            case 1:
                return pwRegex.test(input) ? 1 : 0;
            case 2:
                return input === requiredInputs[idx - 1].value ? 1 : 0;
            case 3:
                return nameRegex.test(input) ? 1 : 0;
            case 4:
                return nicknameRegex.test(input) ? 1 : 0;
            case 5:
                return emailRegex.test(userEmail) ? 1 : 0;
            default:
                return;
        }
    }

    // 유효메시지 CSS 적용 함수, (메시지, 메시지타입-> 0: 공백, 1: 문제없음, 2: 문제있음, 3: 사용가능. 4: 사용불가능, 5: 중복검사 안했을 때)
    function validMsgCss(msg, msgType, idx) {
        switch (msgType) {
            case 0:
                msg.css({ "display": "grid", "color": "red" });
                msg.text("*빈칸을 채워주세요.");
                break;
            case 1:             // 문제 없을 때
                msg.text("");
                msg.hide();
                break;
            case 2:             // 문제 있을 때
                msg.css({ "display": "grid", "color": "red" });
                validMsg(msg, idx);
                break;
            case 3:             // 중복검사시 사용가능 할 때
                msg.css({ "display": "grid", "color": "green" });
                return msg.text("사용가능합니다.");
            case 4:
                msg.css({ "display": "grid", "color": "red" });
                return msg.text("중복됩니다.");
            case 5:
                msg.css({ "display": "grid", "color": "red" });
                return msg.text("중복검사를 해주세요.");
            default:
                break;
        }
    }

    // 문제 있을 시 해당 기입란에 맞는 메시지 출력
    function validMsg(msg, idx) {
        switch (idx) {
            case 0:
                return msg.text("*길이제한: 7 ~ 20, 한글x, 특수문자x");
            case 1:
                return msg.text("*길이제한: 10 ~ 30, 한글x, 특수문자 (.,/?!@#$%^&*) 허용");
            case 2:
                return msg.text("*비밀번호가 다릅니다.");
            case 3:
                return msg.text("*길이제한: 2 ~ 10, 숫자x");
            case 4:
                return msg.text("*길이제한: 2 ~ 15");
            case 5:
                return msg.text("*이메일 형식을 확인해주세요. ex) test@test.com");
            default:
                return;
        }
    }


    // 중복 검사, ajax 사용해서 db체크후 반환
    function checkDuplicate(val, btnIdx) {
        $.ajax({
            url: '/user/duplicate',
            method: 'POST',
            data: { val: val, idx: btnIdx },
            dataType: 'json',
            success: function (data) {
                if (data.isTrue) {                                                          // 중복일 때
                    btnIdx === 0 ? isCheckDuplicate[0] = false : isCheckDuplicate[1] = false;
                    return validMsgCss($(".validation-message").eq(btnIdx), 4, btnIdx);
                } else {                                                                    // 중복 아닐 때
                    btnIdx === 0 ? isCheckDuplicate[0] = true : isCheckDuplicate[1] = true;
                    return validMsgCss($(".validation-message").eq(btnIdx), 3, btnIdx);
                }
            },
            error: function (xhr, status, error) {
                console.log("에러: ", error);
            }
        })
    }



    // 이메일
    // 이메일 옵션 바꿀 시
    $("#user-email-input").change(function () {
        // 직접입력 일때
        if ($("#select-email-option").val() === "userInput") {
            userEmail = `${$("#user-email-input").val()}@${$(".custom-input").val()}`;
        } else {
            userEmail = `${$("#user-email-input").val()}@${$("#select-email-option").val()}`;
        }
        $("#email").val(userEmail);
        checkValidity(5);
    });

    $("#select-email-option").change(function () {
        if ($(this).val() == "userInput") {
            $(".custom-input").show();
            userEmail = `${$("#user-email-input").val()}@${$(this).val()}`;
        } else {
            $(".custom-input").hide();
            $(".custom-input").val("");
            userEmail = `${$("#user-email-input").val()}@${$(this).val()}`;
        }
        $("#email").val(userEmail);
        checkValidity(5);
    });

    // 이메일 직접입력란 값 바뀔 시
    $(".custom-input").change(function () {
        userEmail = `${$("#user-email-input").val()}@${$(".custom-input").val()}`;
        $("#email").val(userEmail);
        checkValidity(5);
    });
});