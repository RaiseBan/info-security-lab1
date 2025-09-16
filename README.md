# Разработка защищенного REST API с интеграцией в CI/CD

## Описание проекта и API

REST API на Node.js + Express с системой аутентификации и управления заказами.

### Эндпоинты:

**POST /auth/register** - регистрация нового пользователя
- Тело: `{"username": "user", "password": "Password123!"}`
- Валидация: username 3-50 символов, password минимум 8 символов с заглавными, строчными, цифрами и спецсимволами
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"TestPass123!"}'
```

**POST /auth/login** - аутентификация пользователя
- Тело: `{"username": "user", "password": "Password123!"}`
- Ответ: JWT токен и информация о пользователе
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"TestPass123!"}'
```

**GET /api/orders** - получение заказов пользователя (требует токен)
- Заголовок: `Authorization: Bearer <token>`
- Ответ: список заказов пользователя
```bash
curl -X GET http://localhost:8080/api/orders \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**POST /api/orders** - создание заказа (требует токен)
- Тело: `{"title": "Order", "description": "Description", "amount": 100.50}`
- Валидация: title 1-100 символов, description 1-500 символов, amount положительное число
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Order","description":"Test Description","amount":100.50}'
```

**GET /health** - проверка состояния сервера
- Ответ: статус сервера и timestamp
```bash
curl -X GET http://localhost:8080/health
```

## Реализованные меры защиты

### 1. Защита от SQL-инъекций
- **TypeORM с параметризованными запросами** - все операции с БД выполняются через ORM методы
- **Отсутствие конкатенации строк** в SQL запросах
- Примеры: `userRepo.findOne({where: {username: username}})`, `orderRepository.find({where: { user: { id: userId }}})`
- **Безопасные отношения** между сущностями через TypeORM relations

### 2. Защита от XSS
- **Автоматическая санитизация** всех входящих данных с помощью `escape-html`
- **Middleware sanitizeInput** обрабатывает все строковые поля в req.body
- **Валидация входных данных** с express-validator
- **Экранирование HTML** символов в пользовательском контенте

### 3. Защита от Broken Authentication
- **JWT токены**: 
  - Срок действия 24 часа
  - Middleware проверяет токен на всех защищенных эндпоинтах
  - Секретный ключ из переменных окружения
- **Безопасное хэширование паролей**:
  - bcrypt с 10 раундами соли
  - Автоматическое хэширование при сохранении пользователя
  - Сравнение хэшей при аутентификации
- **Строгая валидация паролей**: минимум 8 символов, обязательные заглавные, строчные буквы, цифры и спецсимволы

### 4. Дополнительные меры безопасности
- **Rate Limiting**: 
  - Аутентификация: максимум 5 попыток за 15 минут на IP
  - API запросы: максимум 10 запросов в минуту на IP
- **HTTP Security Headers** с помощью Helmet.js
- **CORS политика** для контроля доступа
- **Ограничение размера запросов** до 1MB
- **Логирование** с помощью Winston и Morgan
- **Обработка ошибок JSON парсинга**

## Скриншоты отчетов SAST/SCA

### GitHub Actions Pipeline
![GitHub Actions Success](screenshots/githubAction.jpg)

### npm audit отчет
![npm audit report](screenshots/audit-report.jpg)

### Snyk отчет
![npm audit report](screenshots/snyk-report.jpg)

### Snyk Security отчет  
![Snyk report](screenshots/snyk-scan-alerts.jpg)

