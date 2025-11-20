## Сборка приложения (через docker compose) 
```bash
docker compose up --build
```

## Автотесты
```bash
npm test
```

## Curl примеры 

- **Регистрация**
  ```bash
  curl -X POST http://localhost:3000/signup \
    -H "Content-Type: application/json" \
    -d '{"id":"user@example.com","password":"Passw0rd!"}'
  ```

- **Вход**
  ```bash
  curl -X POST http://localhost:3000/signin \
    -H "Content-Type: application/json" \
    -d '{"id":"user@example.com","password":"Passw0rd!"}'
  ```

- **Refresh token**
  ```bash
  curl -X POST http://localhost:3000/signin/new_token \
    -H "Content-Type: application/json" \
    -d '{"refreshToken":"<REFRESH_TOKEN>"}'
  ```

- **Получить данные по юзеру**
  ```bash
  curl http://localhost:3000/info \
    -H "Authorization: Bearer <ACCESS_TOKEN>"
  ```

- **Разорвать сессию**
  ```bash
  curl http://localhost:3000/logout \
    -H "Authorization: Bearer <ACCESS_TOKEN>"
  ```

- **Загрузить файл**
  ```bash
  curl -X POST http://localhost:3000/file/upload \
    -H "Authorization: Bearer <ACCESS_TOKEN>" \
    -F "file=@/path/to/file.pdf"
  ```

- **Посмотреть файлы**
  ```bash
  curl "http://localhost:3000/file/list?page=1&list_size=5" \
    -H "Authorization: Bearer <ACCESS_TOKEN>"
  ```

- **Получить данные по одному файлу**
  ```bash
  curl http://localhost:3000/file/1 \
    -H "Authorization: Bearer <ACCESS_TOKEN>"
  ```

- **Скачать файл**
  ```bash
  curl -L http://localhost:3000/file/download/1 \
    -H "Authorization: Bearer <ACCESS_TOKEN>" \
    -o downloaded-file.bin
  ```

- **Обновить файл**
  ```bash
  curl -X PUT http://localhost:3000/file/update/1 \
    -H "Authorization: Bearer <ACCESS_TOKEN>" \
    -F "file=@/path/to/new-file.pdf"
  ```

- **Удалить файлe**
  ```bash
  curl -X DELETE http://localhost:3000/file/delete/1 \
    -H "Authorization: Bearer <ACCESS_TOKEN>"
  ```

Примечание: для простоты проверки я захардкодил переменные окружения сразу в .env
