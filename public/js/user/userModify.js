$(function () {
    // 이메일 select value 변할 시
    $("#select-email-option").change(function () {
        $(".custom-input").val("");
        $(this).val() !== "userInput" ? $(".custom-input").hide() : $(".custom-input").show();
    });



    // // 토글 스위치 클릭시 버튼 효과 구현
    // $("#notification-toggle-switch").click(function () {
    //     isNotificationOn = !$("#toggle").prop("checked");
    //     // console.log(isNotificationOn);
    //     $(".toggle-swt").toggleClass("toggle-swt-checked");
    //     $(".toggle-btn").toggleClass("toggle-btn-checked");
    // });
});