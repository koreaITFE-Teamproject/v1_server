$(document).ready(function(){
    // "확인" 요소에 마우스 오버 시 커서 모양 변경
    $('#ck_button').mouseover(function(){
        $(this).css('cursor', 'pointer');
    })
    // 비밀번호 제약 : 공백 입력 금지, 02~30자
    $('.name_input').on('input',function(){
        var input = $(this).val()
        if(input.length>=30){
            alert("비밀번호는 30자이하 입니다.")
            $(this).val(name.substring(0, 30));
        }
        if (/\s/.test(input)) {
        alert('공백을 입력할 수 없습니다.');
        $(this).val(input.replace(/\s/g, ''));
    }
})

// 확인 버튼 눌렀을때 동작
$('#ck_button').on('click',function(){
    var newpw = $("#newpw").val()
    var newpw_ck = $("#newpw_ck").val()

    // 공백 여부 확인
    if (newpw.trim() === '' || newpw_ck.trim() === '') {
        alert("비밀번호를 입력해주세요")
        return
    }
    if(newpw.length<10 || newpw_ck.length<10){
        alert("비밀번호는 10자 이상 30자 이하입니다.")
        return
    }
    if(newpw!=newpw_ck){
        alert("비밀번호가 동일하지 않습니다.")
        return
    }
        alert("비밀번호가 동일합니다") // 페이지 완성되면 동일했을때 메인으로 넘어가는걸로 수정
})
})