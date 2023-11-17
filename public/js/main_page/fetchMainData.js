$(function () {
    fetchMainData();

    function fetchMainData() {
        $.ajax({
            url: `http://localhost:3000/main/fetchColum`,
            method: "GET",
            dataType: "json",
            success: function (data) {
                let resultData = data.column;

                for (var i = 0; i < 10; i++) {
                    addColumnData(resultData, i);
                }
            },
            error: function (err) {
                console.error("Error:", err);
            },
        });
    }

    function addColumnData(rd, i) {
        $("#column_container>div").append(`
            <a id="column${i}" class="column" href="/column/read/${rd[i].ROW_NUM}">
                <div class="column_info">
                    <span>${rd[i].sj}</span>
                    <span>${rd[i].COLMN_WRTER}</span>
                </div>
            </a>
        `);

        $(`#column${i}`).css("backgroundImage", `url(${!rd[i].cip ? "http://placehold.it/480x585" : rd[i].cip})`);
        // $(`#column${i}`).css("backgroundImage", `url(${rd[i].cip})`);
    }



    let count = 0;

    const colTypes = ['==선택==', ' 국내 소설', '해외 소설', '시/에세이', '인문', '가정/육아', '요리', '건강', '취미/실용', '경제/경영',
        '자기계발', '정치/사회', '역사/문화', '종교', '예술/대중문화', '기술공학', '외국어', '여행', '컴퓨터/IT', '잡지', '만화'];

    addColumnTypeData();

    function addColumnTypeData() {
        for (var i = 0; i < 4; i++) {
            $("#class_frame").append(`
                <div class="recomm_bar">
                    <div class="class_item" onclick="location.href='../column/all/${count + 1}'">${colTypes[count++ + 1]}</div>
                    <div class="class_item" onclick="location.href='../column/all/${count + 1}'">${colTypes[count++ + 1]}</div>
                    <div class="class_item" onclick="location.href='../column/all/${count + 1}'">${colTypes[count++ + 1]}</div>
                    <div class="class_item" onclick="location.href='../column/all/${count + 1}'">${colTypes[count++ + 1]}</div>
                    <div class="class_item" onclick="location.href='../column/all/${count + 1}'">${colTypes[count++ + 1]}</div>
                </div>
            `)
        }
    }
});

function showTypeList(colType) {
    $.ajax({
        url: `http://localhost:3000/column/all`,
        method: "GET",
        data: { colType: colType },
        dataType: "json",
        success: function (data) {
            window.location.href = '../column/all';
        },
        error: function (err) {
            console.error("Error:", err);
        },
    });
}