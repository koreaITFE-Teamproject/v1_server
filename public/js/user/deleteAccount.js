// jquery로 변경
$(function () {
    $("#withdrawButton").click(function (e){
        e.preventDefault();
        AlertCheckbox();
    });

    // ALL NO checked 함수
    function AlertCheckbox() {
        const checkboxes = $(".checkbox-part input");
        let checkedCnt = 0;

        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked === true) {
                checkedCnt++;
            }
        }

        // 아무것도 선택 안했을 시
        if (checkedCnt == 0) {
            return alert("체크박스를 선택해주세요.")
        }

        // 비밀번호 입력 확인
        if (!$("#passwordInput").val().trim()) {         // 실패 시
            $("#passwordInput").val("");                 // 초기화
            return alert('비밀번호를 작성해 주세요.');     // 비밀번호가 비어있을 때 경고 메시지 표시
        }

        alert('탈퇴되었습니다.');
    }
});