$(function () {
    $(".options>div>i:nth-child(2)").hide();

    $(".toggle-swt").click(function (event) {
        toggleSWT($(this), event)
    })

    $(".toggle-btn").click(function (event) {
        toggleSWT($(this).parent(), event)
    });

    $(".options>div").click(function (event) {
        toggleSWT($(this).children().eq(3), event);
    });

    function toggleSWT($this, e) {
        e.stopPropagation(); // 이벤트 버블링 중단, 겹쳐서 눌려지는거 방지
        $this.toggleClass("toggle-swt-checked");
        $this.children().toggleClass("toggle-btn-checked");
    }
});