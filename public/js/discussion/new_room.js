$(function () {
    $("#create-room-form").submit(function (event) {
        isBlank(event, $(".text-field").val());
    });

    function isBlank(event, roomName) {
        if (!roomName.trim()) {
            alert("제목을 입력하세요.");
            $(".text-field").val("");
            return event.preventDefault();
        }
    }
});