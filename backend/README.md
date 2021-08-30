# LinkedBook Backend

#### :star: You can change environment according to your setting
### Local Env
- Java 11
- MYSQL Workbench 8.0.25
- Intellij Ultimate 2021.1

### Server Env
- AWS EC2 (build & deploy server)
- AWS RDS (DB server)
- AWS S3 (image server)
- Redis 5.0.7 (cache server)

### API
- [Kakao API](https://developers.kakao.com/)
- [Google API](https://console.developers.google.com/apis/credentials)

<br>

## ✔ How to start project in local environment
### 1. Clone this repository
```
// 레포지토리 클론
$ git clone <https://github.com/jjuyeon/LinkedBook.git>

// 경로 변경
$ cd LinkedBook/backend
```

### 2. Setup application.yml
```
# src/main/resources/application.yml
spring:
  datasource:
    hikari:
      driver-class-name: ${YOUR_DATABASE_DIRVER_CLASS_NAME}
      jdbc-url: ${YOUR_DATABASE_URL}
      username: ${YOUR_DATABASE_USERNAME}
      password: ${YOUR_DATABASE_PASSWORD}
  jpa:
    hibernate:
      use-new-id-generator-mappings: false
  redis:
    host: ${YOUR_REDIS_SERVER_HOST}
    port: ${YOUR_REDIS_SERVER_PORT}
  mail:
    host: ${YOUR_EMAIL_AUTHENTICATION_HOST}
    port: ${YOUR_EMAIL_AUTHENTICATION_PORT}
    username: ${YOUR_EMAIL}
    password: ${${YOUR_EMAIL_PASSWORD}
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
custom:
  oauth2:
    google:
      client:
        id: ${YOUR_GOOGLE_OAUTH_CLIENT_ID}
        secret: ${YOUR_GOOGLE_OAUTH_CLIENT_SECRET}
    kakao:
      client:
        id: ${YOUR_KAKAO_OAUTH_CLIENT_ID}
  constant:
    access:
      token:
        secret:
          key: ${YOUR_ACCESS_TOKEN_SECRET_KEY}
    user:
      info:
        password:
          key: ${YOUR_USER_INFO_PASSWORD_KEY}

server:
  servlet:
    context-path: "/api"
```
### 3. Start Project
> Before starting, you need to create a **Q table** through build (Querydsl setting)

> Right-click on the project folder - [Run As] - [Spring Boot App] 

## ✔ Tech Stack
| Usage             | Stack                    |
| ----------------- | ------------------------ |
| `Spring Boot`     | Backend Framework        |
| `Spring Data JPA` | JPA Library(Module)      |
| `Spring Security` | Authentication Framework |
| `Querydsl`        | Domain Specific Language |
| `MySQL`           | Database                 |
| `JWT`             | JSON Web Token           |

## ✔ Project Structure
- `src/` 하위 폴더들은 다음과 같은 역할을 한다.
- `configuration/` : 프로젝트를 실행하기 위한 설정이 세팅되어 있다.
- `controller/` : 클라이언트의 요청을 받아, 처리한 후 응답 데이터를 넘겨주는 역할을 한다.
- `dao/` : DB에 실질적으로 접근하는 객체들이 행하는 기능들이 정의되어 있다.
- `dto/` : 계층간 데이터 교환을 위한 객체가 정의되어 있다.
- `entity/` : DB의 엔티티가 Spring Boot JPA에 맞게 세팅되어 있다.
- `response/` : 처리에 대한 응답 구조와 응답 리스트가 정의되어 있다.
- `service/` : 실질적으로 클라이언트의 요청을 처리하는 business logic이 정의되어 있다.
- `serviceImpl/` :  service interface로부터 받은 business logic이 구현되어 있다.

## ✔ cf) LinkedBook ERD , API Document
1. ERD Document
- https://docs.google.com/spreadsheets/d/1VoYQISpulwv19X4oNLOIgamCxCAWmmZofFWO967YRnc/edit?usp=sharing
2. API Document
- https://docs.google.com/spreadsheets/d/1fjFFgKumbnsU-QEWSM3NHWMAKp07FqtRqpjKL9BmCQI/edit?usp=sharing
