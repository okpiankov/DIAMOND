# Интернет-магазин на  Vue3 с личный кабинетом админкой  и своим сервером на Express + MongoDB

### Деплой на Timeweb Cloud на облачном сервере: http://diamond.tw1.ru:5173/
### Изначально репозиторий клиентской части:  https://github.com/okpiankov/MYSHOP_Vue 

###  Используемые технологии при разработке: html, scss, tailwindcss, JavaScript, Vue3, Pinia, TypeScript, NodeJS, Express, MongoDB

### Функционал клиентская часть:
- Vue3 composition api
- Мной разработан современный модный дизайн магазина
- Роутинг- vue-router. Отдельный layout для личного кабинета и админки
- Регистрация и авторизация, защищенные роуты, роли пользователей
- Реализован поиск товаров на сервере
- Страница с оформленными заказами реализована через связь двух  коллекций «заказы» и «пользователи» на сервере. У каждого пользователя- свои заказы
- В корзине можно изменить количество товара или удалить товар. Сохранение товара в корзину происходит при нажатия на иконку  «алмаз»
- 2 вида карточек товаров mini и big 
- Форма с авторизацией и регистрацией, корзина(главная), правая панель навигации реализованны через PopUp
- Адаптивная верстка под планшет max-width: 1200px и 770px , под смартфон max-width: 440px
- Используется axios. Запросы GET, POST, PATCH, DELETE
- Кастомная валидация форм
- Pinia. Товары в корзине  и данные пользователей сохраняются в Pinia
- Используется библиотека иконок lucide-vue-next
- Реализована различная анимация
- В админке можно создавать новые товары и новых пользователей, редактировать и удалять их. Загружать файлы(картинки) на сервер и удалять
- В админке можно создавать новые заказы, удалять, редактировать массив товаров в отдельном заказе
- В админке все товары, пользователи, заказы выводятся списками
- Проект написан на TypeScript

### Функционал серверная  часть:
- Используются  NodeJS, Express, Mongoose, MongoDB
- Реализован функционал оформления заказа не авторизованным пользователем с записью пользователя и заказа в БД
- Используется библ. multer для сохранения файлов на сервер
- Используется библ. jsonwebtoken для создания токенов
- Пароли пользователей шифруются   через библ. bcrypt
- Каждая функция-контроллер возвращает на клиент коды результата выполнения запроса с текстовым разъяснением ошибки при наличии
- Реализованы связи между коллекциями в БД
- Middleware для расшифровки и проверки токена  приходящего с запросом с клиента.  В целях безопасности проверяю все важные  роуты через middleware.
- Токен передается через cookie . Произведена настройка cookie, установлена  опция httpOnly:  true.  Соответственно украсть токен невозможно и все важные роуты под защитой.

### Доступ в админку:
Тестовые админские логин и пароль:\
логин: admin@test.com\
пароль: 123\

Тестовые пользовательские логин и пароль:\
логин: user@test.com\
пароль: 123\
Либо зарегистрируйте своего пользователя

### Установка проекта:
Для запуска на локальной машине необходимо:\
Установить npm зависимости: npm install\
Запустить одновременно 2 рабочих окна в редакторе кода:\
Запустить в режиме разработки клиентскую часть: npm run dev\
Если все успешно, клиентская часть будет запущена на http://localhost:5173
Запустить в режиме разработки серверную часть: npm run start\
Если все успешно, серверная часть будет запущена на http://localhost:3333
