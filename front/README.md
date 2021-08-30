# LinkedBook Frontend

![Generic badge](https://img.shields.io/badge/react-v17.0.2-green.svg) ![Generic badge](https://img.shields.io/badge/node-14.17.1-yellow.svg) ![sockjs](https://img.shields.io/npm/v/sockjs?color=critical&label=sockjs) ![stompjs](https://img.shields.io/npm/v/stompjs?color=orange&label=stompjs) ![node](https://img.shields.io/npm/v/node) ![redux](https://img.shields.io/npm/v/redux?color=blue&label=redux) ![styled-components](https://img.shields.io/npm/v/styled-components?color=ff69b4&label=styled-components) ![webpack](https://img.shields.io/npm/v/webpack?color=yellow&label=webpack)

<br>

## ✔ How to start project in local environment

```
// 레포지토리 클론
$ git clone <https://github.com/jjuyeon/LinkedBook.git>

// 경로 변경
$ cd LinkedBook/front

// npm package install
$ npm install

// 프로젝트 실행
$ npm start
```

## ✔ Tech Stack

| Usage               | Stack            |
| ------------------- | ---------------- |
| `React`             | Fronted Library  |
| `Redux`             | State  Container |
| `Axios`             | HTTP Library     |
| `HTML/JSX`          | Markup Language  |
| `Styled-components` | Styling          |

## ✔ Project Structure

- `src/` 하위 폴더들은 다음과 같은 역할을 한다.
- `pages/` : 최상위 컴포넌트들을 포함하며 로직 구현에 집중한다.
- `components/` : `page/` 의 최상위 컴포넌트에 포함되는 하위 컴포넌트를 정의하며 표현에 집중한다.
- `actions/` : 최상위 컴포넌트 별로 분리된 dispatch 요청이 정의되어 있다.
- `reducers/` : 최상위 컴포넌트 별로 분리된 reducer가 정의되어 있다.
- `store/` : 모든 reducer를 모으고 store가 정의되어 있다.
- `hooks/` : 커스텀 훅들이 정의되어 있다.
- `lib/` : URL 접근 제한을 위한 컴포넌트가 정의되어 있다.
- `styles/` :  전역 스타일이 변수로 지정되어 있다.

## ✔ How to use 'api.js'

1. **get 요청**

   - ex) ```http://localhost:8080/api/deals?search=어린&filter=NEW&page=0&size=10``` 으로 보낼때

   ```jsx
   // function requestGet(url, params);
   requestGet("/deals", {search: '어린', filter: 'NEW', page: 0, size: 10})
   ```

2. **나머지**

   - ex) ```http:/localhost:8080/api/reports``` 로 POST 요청 보낼 때

   ```jsx
   // function request(method, url, data);
   request('POST', '/reports', {dealId: 5, category: 'MANNER', content: '욕설'})
   ```
