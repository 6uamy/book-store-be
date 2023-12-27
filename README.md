# API-design

## ⚙ 회원 API

### 회원가입

- 이메일
- 비밀번호

| Method               | POST                                             |
|----------------------|--------------------------------------------------|
| **URI**              | /users/join                                      |
| **HTTP status code** | Success: 201, Fail: 400                          |
| **Request Body**     | { email: "string@mail.com", password: "string" } |
| **Response Body**    |                                                  |

### 로그인

- 이메일
- 비밀번호

| Method               | POST                                             |
|----------------------|--------------------------------------------------|
| **URI**              | /users/login                                      |
| **HTTP status code** | Success: 200, Fail: 404                          |     
| **Request Body**     | { email: "string@mail.com", password: "string" } |
| **Response Body**    | JWT Token                                        |

### 비밀번호 초기화 요청

- 이메일

| Method               | POST                         |
|----------------------|------------------------------|
| **URI**              | /users/reset                 |
| **HTTP status code** | Success: 200, Fail: 404      |
| **Request Body**     | { email: "string@mail.com" } |
| **Response Body**    |                              |

### 비밀번호 초기화 (=수정)

- 비밀번호

| Method               | PUT                      |
|----------------------|--------------------------|
| **URI**              | /users/reset             |
| **HTTP status code** | Success: 200, Fail: 404  |
| **Request Body**     | { password: "string" }   |
| **Response Body**    |                          |


## ⚙ 도서 API

### 전체 도서 조회

- 대표 이미지 (8개 씩)
- 제목
- 작가
- 요약 정보
- 가격
- 좋아요 수

| Method               | GET                      |
|----------------------|--------------------------|
| **URI**              | /books                   |
| **HTTP status code** | Success: 200, Fail: 404  |
| **Request Body**     |                          |
| **Response Body**    | [ { id: 도서 id, title: "제목", summary: "요약 정보", author: "작가", price: 가격, likes: 좋아요 수, pubDate: "출간일" },<br> { id: 도서 id, title: "제목", summary: "요약 정보", author: "작가", price: 가격, likes: 좋아요 수, pubDate: "출간일"} ... ]        |

### 개별 도서 조회

- 이미지 (여러장의 이미지 배열 => 슬라이드로 구성)
- 제목
- 카테고리
- 포맥
- 작가
- ISBN
- 쪽수
- 요약 설명
- 상세 설명
- 목차
- 가격
- 좋아요 수
- 내가 좋아요를 했는지 여부

| Method               | GET                      |
|----------------------|--------------------------|
| **URI**              | /books/{bookId}          |
| **HTTP status code** | Success: 200, Fail: 404  |
| **Request Body**     |                          |
| **Response Body**    | { id: 도서 id, title: "제목", category: "카테고리", format: "포맷", ISBN: ISBN, summary: "요약 정보", description: "상세 설명" , author: "작가", pages: 쪽 수, index: "목차", price: 가격, likes: 좋아요 수, liked: boolean, pubDate: "출간일" } |

### 카테고리별 도서 목록 조회

- new: true => 신간 조회 (기준: 출간일 30일 이내)


| Method               | GET                      |
|----------------------|--------------------------|
| **URI**              | /books?categoryId={category}&new={boolean} |
| **HTTP status code** | Success: 200, Fail: 404  |
| **Request Body**     |                          |
| **Response Body**    | [ { id: 도서 id, title: "제목", summary: "요약 정보", author: "작가", price: 가격, likes: 좋아요 수, pubDate: "출간일" },<br> { id: 도서 id, title: "제목", summary: "요약 정보", author: "작가", price: 가격, likes: 좋아요 수, pubDate: "출간일" } ... ]        |



## ⚙ 좋아요 API

### 좋아요 추가

| Method               | PUT                                              |
|----------------------|--------------------------------------------------|
| **URI**              | /likes/{bookId}                                  |
| **HTTP status code** | Success: 200, Fail: 400                          |
| **Request Body**     |                                                  |
| **Response Body**    |                                                  |


## ⚙ 장바구니 API

### 장바구니 담기

| Method               | POST                                             |
|----------------------|--------------------------------------------------|
| **URI**              | /cart                                            |
| **HTTP status code** | Success: 201, Fail: 400                          |
| **Request Body**     | { bookId: 도서 id, count: 수량 }                  |
| **Response Body**    |                                                  |

### 장바구니 조회

- 대표이미지
- 제목
- 요약 정보
- 수량
- 금액

| Method               | GET                                              |
|----------------------|--------------------------------------------------|
| **URI**              | /cart                                            |
| **HTTP status code** | Success: 200, Fail: 404                          |
| **Request Body**     |                                                  |
| **Response Body**    | [ { cartItemId: 장바구니 도서 id, bookId: 도서 id, title: "도서 제목", summary: "요약 정보", count: 수량, price: 가격 }, { cartItemId: 장바구니 도서 id, bookId: 도서 id, title: "도서 제목", summary: "요약 정보", count: 수량, price: 가격 } ... ] |

### 장바구니 도서 삭제

| Method               | DELETE                  |
|----------------------|-------------------------|
| **URI**              | /cart/{bookId}          |
| **HTTP status code** | Success: 200, Fail: 400 |
| **Request Body**     |                         |
| **Response Body**    |                         |



## ⚙ 주문 API

- 장바구니에서 체크된 상품에 대한 주문 요청 (제목, 요약 정보, 가격)

### 장바구니에서 선택한 상품 목록 조회

| Method               | GET                                              |
|----------------------|--------------------------------------------------|
| **URI**              | /..                                          |
| **HTTP status code** | Success: 200, Fail: 404                          |
| **Request Body**     |                                                  |
| **Response Body**    | [ { cartItemId: 장바구니 도서 id, bookId: 도서 id, title: "도서 제목", summary: "요약 정보", count: 수량, price: 가격 }, { cartItemId: 장바구니 도서 id, bookId: 도서 id, title: "도서 제목", summary: "요약 정보", count: 수량, price: 가격 } ... ] |