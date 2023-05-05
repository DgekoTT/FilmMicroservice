# Указываем базовый образ
FROM node

# Устанавливаем рабочую директорию
WORKDIR /film

# Копируем package.json  для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код приложения
COPY . .

# Открываем порт, на котором будет работать приложение
EXPOSE 5000

CMD ["npm", "run", "start:devFilmDD"]