## 테스트유저 아이디, 비밀번호
1. id: `testId번호`      ex) testId01    , testId05
2. pw: `testPw번호!@`    ex) testPw01!@  , testPw05!@

## router
- get, post 방식은 각자 페이지 수정하면서 변경해야합니다. 현재는 페이지만 연결해둔 상태입니다.
1. main.js        메인
2. user.js        유저
3. discussion.js  토론방
4. customer.js    고객센터

## 폴더 경로
1. css- public/css
2. js - public/js
3. img- public/img
4. html 파일- views/

## url
기본형태 - (localhost):3000/

### 1. 메인
| 페이지 | /router | /page | `전체` |
| ------ | ------- | ----- | ------ |
| 메 인 | /main | /home | `/main/home` |
| 개인정보처리방침 | /main | /privacy_policy | `/main/privacy_policy` |
| 검 색 | /main | /search | `/main/search` |
| 사이트 소개 | /main | /site_introduction | `/main/site_introduction` |

### 2. 유저
| 페이지 | /router | /page | `전체` |
| --- | --- | --- | --- |
| 회원가입 | /user | /join | `/user/join` |
| 로그인 | /user | /login | `/user/login` |
| 수 정 | /user | /modify | `/user/modify` |
| 비밀번호 변경 | /user | /passwd_reset | `/user/passwd_reset` |
| 비밀번호 찾기 | /user | /passwd_find | `/user/passwd_find` |
| 회원탈퇴 | /user | /delete_account | `/user/delete_account` |
| 아이디찾기1 | /user | /findById1 | `/user/findById1` |
| 아이디찾기2 | /user | /findById2 | `/user/findById2` |
| 전체컬럼 | /user | /all_column | `/user/all_column` |
| 구독컬럼 | /user | /sub_column | `/user/sub_column` |
| 좋아요컬럼 | /user | /like_column | `/user/like_column` |
| 컬럼작성 | /user | /write_column | `/user/write_column` |
| 컬럼읽기 | /user | /read_column | `/user/read_column` |

### 3. 토론방
| 페이지 | /router | /page | `전체` |
| --- | --- | --- | --- |
| 토론방 목록 | /discussion | /room_list | `/discussion/room_list` |
| 토론방(일반) | /discussion | /chatting_room | `/discussion/chatting_room` |
| 토론방(화상) | /discussion | /video_chat_room | `/discussion/video_chat_room` |
| 토론방 생성 | /discussion | /create_room | `/discussion/create_room` |

### 4. 고객센터
| 페이지 | /router | /page | `전체` |
| --- | --- | --- | --- |
| 챗 봇 | /customer | /chatbot | `/customer/chatbot` |
| 1:1 고객센터 | /customer | /center | `/customer/center` |
