$(function () {
    $(".add-btn").click(function () {
        if (!$(".text-field").val().trim()) {
            alert("제목을 입력하세요.");
            $(".text-field").val("");
        } else {
            alert("토론방 생성 완료");
        }
    });
});