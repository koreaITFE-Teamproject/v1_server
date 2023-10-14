$(document).ready(function () {
  $.ajax({
    url: "http://localhost:3000/getList",
    method: "GET",
    dataType: "json",
    success: function (data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        console.log(data[i]);
        var postBody = $("#postBody");
        var postBodyData = "<tr>";
        postBodyData += `<td>${data[i].no}</td>`;
        postBodyData += `<td>${data[i].title}</td>`;
        postBodyData += `<td>${data[i].writer}</td>`;
        postBodyData += `<td>${data[i].regist_dt}</td>`;
        postBodyData += "</tr>";
        postBody.append(postBodyData);
      }
    },
    error: function (err) {
      console.error("Error:", err);
    },
  });
});
