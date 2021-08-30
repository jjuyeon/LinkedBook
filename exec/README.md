# How to build & deploy LinkedBook project

## 1. Setting
- NodeJS: 14.17.1
- Web Server: Nginx
- JVM: java-11-openjdk-amd64 
- Gradle: 6.3
- WAS: Tomcat 9.0.33
- Redis: 5.0.7
- Frontend IDE: Visual Studio 1.59
- Backend IDE: Intellij Ultimate 2021.1
- MYSQL Workbench 8.0.25

## 2. Setup Web Server
- Install Nginx
```
$ sudo apt-get update

$ sudo apt-get upgrade

// nginx install
$ sudo apt-get install nginx
```
- Move LinkedBook's build file to Nginx root directory(/usr/share/nginx/html)
```
$ cd LinkedBook/front

// npm package install
$ npm install

// project build
$ npm run build

// project deploy
$ cp build/* /usr/share/nginx/html
```
- Set up Nginx conf file
```
$ cd /etc/nginx/sites-available

$ vi default
```

```
server {
    listen      80 default_server;
    listen [::]:80 default_server;

    root /usr/share/nginx/html;
    index index.html index.htm;
    server_name _;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080/api;
        proxy_redirect off;
        charset utf-8;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-NginX-Proxy true;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_http_version 1.1;
    }
}
```
- Restart Nginx
```
$ sudo service nginx start
```

## 3. Setup Redis Server
```
$ sudo apt-get install redis-server

$ sudo service redis-server start
```

## 4. Setup application.yml
- Set environment variables according to your project. 
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

## 5. Setup Web Application Server
- Before deploying, you have to set application.yml in your project
```
$ cd LinkedBook/backend

$ chmod +x gradlew

// project build
$ ./gradlew build

// project deploy
$ cd build/libs
$ java -jar linked_book_api-1.0.jar
```
## 6. API
- [KAKAO LOGIN API](https://developers.kakao.com/)
- [GOOGLE LOGIN API](https://console.developers.google.com/apis/credentials)

## 7. ERD Description
[LinkedBook ERD](https://docs.google.com/spreadsheets/d/1VoYQISpulwv19X4oNLOIgamCxCAWmmZofFWO967YRnc/edit?usp=sharing)