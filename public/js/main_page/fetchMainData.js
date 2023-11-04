$(function () {
    let columnI = 0;

    fetchMainData();

    // 페이지 데이터를 가져오는 함수
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

                columnI = 0;
                for (var i = 0; i < 3; i++) {
                    addData(resultData);
                }

            },
            error: function (err) {
                console.error("Error:", err);
            },
        });
    }

    function addData(rd) {
        $("#column_slide_bar").append(`
        <div class="cut_div">
            <div class="bar_item">
                <a href="/column/read/${rd[0 + columnI].ROW_NUM}">
                    <img class="column_img" src="${!rd[0 + columnI].cip ? 'http://placehold.it/300x240' : rd[0 + columnI].cip}">
                    <div class="column_title">${rd[0 + columnI].sj}</div>
                    <div class="column_writer">${rd[0 + columnI++].COLMN_WRTER}</div>
                </a>
            </div>
            <div class="bar_item">
                <a href="/column/read/${rd[0 + columnI].ROW_NUM}">
                    <img class="column_img" src="${!rd[0 + columnI].cip ? 'http://placehold.it/300x240' : rd[0 + columnI].cip}">
                    <div class="column_title">${rd[0 + columnI].sj}</div>
                    <div class="column_writer">${rd[0 + columnI++].COLMN_WRTER}</div>
                </a>
            </div>
            <div class="bar_item">
                <a href="/column/read/${rd[0 + columnI].ROW_NUM}">
                    <img class="column_img" src="${!rd[0 + columnI].cip ? 'http://placehold.it/300x240' : rd[0 + columnI].cip}">
                    <div class="column_title">${rd[0 + columnI].sj}</div>
                    <div class="column_writer">${rd[0 + columnI++].COLMN_WRTER}</div>
                </a>
            </div>
            <div class="bar_item">
                <a href="/column/read/${rd[0 + columnI].ROW_NUM}">
                    <img class="column_img" src="${!rd[0 + columnI].cip ? 'http://placehold.it/300x240' : rd[0 + columnI].cip}">
                    <div class="column_title">${rd[0 + columnI].sj}</div>
                    <div class="column_writer">${rd[0 + columnI++].COLMN_WRTER}</div>
                </a>
            </div>
            <div class="bar_item">
                <a href="/column/read/${rd[0 + columnI].ROW_NUM}">
                    <img class="column_img" src="${!rd[0 + columnI].cip ? 'http://placehold.it/300x240' : rd[0 + columnI].cip}">
                    <div class="column_title">${rd[0 + columnI].sj}</div>
                    <div class="column_writer">${rd[0 + columnI++].COLMN_WRTER}</div>
                </a>
            </div>
        </div>
    `);
    }
});