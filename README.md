# GREEN-API MAX Chat

Веб-приложение чата в стиле мессенджера MAX, разработанное на React + TypeScript с использованием GREEN-API.

Проект выполнен в рамках тестового задания на позицию Frontend React Developer.

## Demo

https://green-api-max-chat-ashen.vercel.app


## Возможности

- Отправка текстовых сообщений через GREEN-API
- Получение входящих текстовых сообщений через receiveNotification
- Удаление обработанных уведомлений
- Проверка состояния подключения GREEN-API
- Интерфейс чата в стиле MAX
- Адаптивная верстка
- Работа с REST API


## Технологии

- React
- TypeScript
- Vite
- CSS
- GREEN-API
- REST API


## Используемые методы GREEN-API

Отправка сообщений:


sendMessage

Получение сообщений:


receiveNotification

Удаление уведомлений:


deleteNotification

Проверка состояния:


getStateInstance


## Запуск проекта локально

Клонировать репозиторий:

```bash
git clone https://github.com/vtsekalo/green-api-max-chat.git

Перейти в папку проекта:
cd green-api-max-chat

Установить зависимости:
npm install

Запустить проект:
npm run dev

Настройка GREEN-API
Для работы приложения необходимо указать:
- API URL
- idInstance
- apiTokenInstance
Данные берутся из личного кабинета GREEN-API.
Структура проекта
src
├── api
│   └── greenApi.ts
│
├── components
│   ├── ChatWindow.tsx
│   ├── ChatWindow.css
│   └── CredentialsForm.tsx
│
├── hooks
│
├── types
│   └── greenApi.ts
│
└── App.tsx

Скриншот
Добавьте сюда скриншот интерфейса:
![MAX Chat](./public/screenshot.png)

Автор
Булат
GitHub:
https://github.com/vtsekalo

После вставки:

В терминале:

```bash
git add README.md
git commit -m "Improve README documentation"
git push