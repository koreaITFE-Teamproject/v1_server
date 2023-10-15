$(function () {

    // 테스트용 생성자 --------
    // 사용자 객체 생성을 위한 생성자 함수 정의
    function User(id, loginId, loginPw, name, nickname, email, phoneNumber, address, isNotificationOn) {
        this.id = id;
        this.loginId = loginId;
        this.loginPw = loginPw;
        this.name = name;
        this.nickname = nickname;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.isNotificationOn = isNotificationOn;
    }

    // 사용자 객체 생성
    var id = 1;             // 유저번호는 1번 부터 시작 -> db는 보통 1부터 시작

    var users = [];

    for (var i = 0; i < 9; i++) {
        var newUser = new User(id++, `testId${i + 1}`, `testPw${i + 1}`, `testName${i + 1}`, `testNickname${i + 1}`, `test${i + 1}@test.com`, `010-0000-000${i + 1}`, "대전", false);
        users.push(newUser);
    }

    // 이메일 테스트
    var newUser = new User(id++, `testId10`, `testPw10`, `testName10`, `testNickname10`, `test10@naver.com`, `010-0000-0010`, "대전", true);
    users.push(newUser);

    // console.log(users);

    var userId = 10;         // 유저번호 입력 시 값 가져오는지 테스트 -> db 연동, id로 해당 id 페이지 열어서 값 가져올 예정
    // 테스트용 --------


    var isNotificationOn = false;
    var userEmail;           // 유저 이메일

    // 클릭한 유저의 아이디로 정보 가져오기
    for (var user of users) {
        if (userId === user.id) {
            $(".user-name-input").val(user.name);           // 닉네임
            $(".user-login-id-input").val(user.loginId);    // id
            $(".user-login-pw-input").add(".user-login-pw-ck-input").val(user.loginPw);   //pw

            // 이메일
            userEmail = user.email;
            var isTrue = false;                                     // 이메일 뒷부분이 select option에 있는지 확인하기 위한 bool타입 변수
            var tempUserEmail = user.email.split("@");                  // @ 자르기
            $(".user-email-input").val(tempUserEmail[0]);               // 이메일 앞부분
            $("#select-email-option>option").each(function () {     // 반복, 이메일 뒷 부분
                if ($(this).val() === tempUserEmail[1]) {               // 현재 select option과 저장되어있는 유저의 email 뒷 부분 일치 시 
                    $(this).prop("selected", true);
                    isTrue = true;
                }
            });

            if (!isTrue) {
                $("#select-email-option").val("userInput");
                $(".custom-input").show();
                $(".custom-input").val(tempUserEmail[1]);
            }


            // 전화번호
            var phonenumbers = user.phoneNumber.split("-"); // 전화번호, - 자르기
            var pnIdx = 0;
            $(".user-phone-number-input").each(function () {
                $(this).val(phonenumbers[pnIdx++]);
            });

            // 주소
            $(".user-address-input").val(user.address);

            // 알림 설정
            if (user.isNotificationOn) {
                $("#toggle").prop("checked", true)
                $(".toggle-swt").toggleClass("toggle-swt-checked");
                $(".toggle-btn").toggleClass("toggle-btn-checked");
            }
        }
    }

    // 저장 버튼 클릭 시
    $("#update-btn").click(function(){
        var userInfo = [];
        $(".editable-info input").each(function(){+
            userInfo.push($(this).val());
        });
        userInfo.pop();
        userInfo.pop();
        userInfo.push(userEmail);
        console.log(userInfo)
        // 현재 사용중인 ""와 같습니다.
        // 사용할 수 없는 "" 입니다.
        // 이미 사용중인 "" 입니다.
    });


    // 이메일 select value 변할 시
    $("#select-email-option").change(function () {
        $(".custom-input").val("");
        $(this).val() !== "userInput" ? $(".custom-input").hide() : $(".custom-input").show();
    });



    // 토글 스위치 클릭시 버튼 효과 구현
    $("#notification-toggle-switch").click(function () {
        isNotificationOn = !$("#toggle").prop("checked");
        // console.log(isNotificationOn);
        $(".toggle-swt").toggleClass("toggle-swt-checked");
        $(".toggle-btn").toggleClass("toggle-btn-checked");
    });
});