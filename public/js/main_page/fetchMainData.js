$(function () {
    let count = 0;

    fetchMainData();

    function fetchMainData() {
        $.ajax({
            url: `http://localhost:3000/main/fetchColum`,
            method: "GET",
            dataType: "json",
            success: function (data) {
                let resultData = data.column;

                console.log(resultData[0]);
                console.log(resultData[0].sj);
                console.log(resultData[0].COLMN_WRTER);
                console.log(resultData[0].ROW_NUM);
                console.log(resultData[0].cip);

                count = 0;

                for (var i = 0; i < 3; i++) {
                    addColumnData(resultData);
                }
            },
            error: function (err) {
                console.error("Error:", err);
            },
        });
    }

    function addColumnData(rd) {
        $("#column_slide_bar").append(`
        <div class="cut_div">
            <div class="bar_item">
                <a href="/column/read/${rd[0 + count].ROW_NUM}">
                    <img class="column_img" src="${!rd[0 + count].cip ? 'http://placehold.it/300x240' : rd[0 + count].cip}">
                    <div class="column_title">${rd[0 + count].sj}</div>
                    <div class="column_writer">${rd[0 + count++].COLMN_WRTER}</div>
                </a>
            </div>
            <div class="bar_item">
                <a href="/column/read/${rd[0 + count].ROW_NUM}">
                    <img class="column_img" src="${!rd[0 + count].cip ? 'http://placehold.it/300x240' : rd[0 + count].cip}">
                    <div class="column_title">${rd[0 + count].sj}</div>
                    <div class="column_writer">${rd[0 + count++].COLMN_WRTER}</div>
                </a>
            </div>
            <div class="bar_item">
                <a href="/column/read/${rd[0 + count].ROW_NUM}">
                    <img class="column_img" src="${!rd[0 + count].cip ? 'http://placehold.it/300x240' : rd[0 + count].cip}">
                    <div class="column_title">${rd[0 + count].sj}</div>
                    <div class="column_writer">${rd[0 + count++].COLMN_WRTER}</div>
                </a>
            </div>
            <div class="bar_item">
                <a href="/column/read/${rd[0 + count].ROW_NUM}">
                    <img class="column_img" src="${!rd[0 + count].cip ? 'http://placehold.it/300x240' : rd[0 + count].cip}">
                    <div class="column_title">${rd[0 + count].sj}</div>
                    <div class="column_writer">${rd[0 + count++].COLMN_WRTER}</div>
                </a>
            </div>
            <div class="bar_item">
                <a href="/column/read/${rd[0 + count].ROW_NUM}">
                    <img class="column_img" src="${!rd[0 + count].cip ? 'http://placehold.it/300x240' : rd[0 + count].cip}">
                    <div class="column_title">${rd[0 + count].sj}</div>
                    <div class="column_writer">${rd[0 + count++].COLMN_WRTER}</div>
                </a>
            </div>
        </div >
        `);
    }


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
        count = 0;
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