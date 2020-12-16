# ITGod 2020 Bot Games

Предлагаем тебе написать своего **бота**, который сойдется в сложной битве против других ботов в игре [IT-God 2020](https://it-god.ru/).

Для участия в мероприятии тебе нужно зарегистрироваться на игровой платформе [IT-God Game](https://game.it-god.ru/), создать бота, выбрать язык из поддерживаемых. На текущий момент поддерживаются следующие языки программирования:

+ C#
+ Python 3.6
+ Java
+ Kotlin
+ Node.js

Детальные инструкции по созданию бота можно прочитать в [разделе 2](#2-создание-бота). После того, как бот был реализован, его можно опубликовать и участвовать в играх с другими ботами и игроками.

Выбор языка программирования для реализации бота ограничен возможностями того или иного языка. Как написать бота на своем любимом языке - см. [раздел 3](#3-создание-бота-на-своем-языке).

Среди ботов будет проводиться турнир - следи за новостями на игровой платформе, сайте и в наших каналах.

> Действия, которые будут представлять риск нанесения ущерба игровой платформе, будут рассматриваться как нарушение и приведут к блокировке участника.

## 1. Описание механики

+ Описание механики
+ Игровые объекты и концепции
+ Игровые взаимодействия
+ Условия победы

См.на сайте [IT-God 2020](https://it-god.ru/) и [здесь](https://sbtatlas.sigma.sbrf.ru/wiki/pages/viewpage.action?pageId=3304956321)

## 2. Создание бота

Для создания бота перейди в раздел `Боты` и выбери `Создать бота`.

При создании, тебе будет предложено дать имя боту, выбрать язык программирования для твоего бота и героя, которого он будет представлять (раса).

На следующем шаге откроется окно редактора бота с загруженным кодом типового бота на выбранном тобой языке программирования.

### 2.1. Отладка бота

Отладка бота возможна в двух режимах:

+ в игровом клиенте
+ в типовом приложении

### 2.2. Отладка бота в игровом клиенте

Для отладки бота в игровом клиенте, создай игру, активируй `Игра с ботами`, нажми применить. В открывшемся окне выбери своего бота из списка напротив слота любого игрока.

Результаты отладки ты будешь видеть на игровом экране в процессе игры или после ее завершения.

### 2.3. Отладка бота в типовом приложении
Для отладки бота в типовом приложении нужно скачать типовой проект, ссылка на который есть в окне редактирования бота.

Типовое приложение подключается к серверу и запускает скрипт бота в начале работы. Приложение скрывает внутри себя взаимодействие с сервером, и является посредником между игровым сервером и решением участника.

Типовой проект ты сможешь запускать у себя локально или в докере, файл которого находится в архиве с проектом. Для отладки можно использовать точки останова, вывод в консоль или в файл.

В каждом архиве проекта в файле `Readme` есть инструкция для работы с проектом на выбранном языке программирования.

## 3. Отладка бота в типовом приложении на языке Node.js

Стратегия бота реализуется в файле `bot.js`. Вместе с типовым приложением поставляется стратегия, сохраненная на игровом сервере на момент скачивания типового приложения.

Типовое приложение подключается к серверу и запускает скрипт бота в начале работы. Приложение стартует один раз, скрипт бота постоянно принимает и обрабатывает входящие сообщения - происходит обработка JSON, данные передаются в State.

После подключения к игре, сервер рассылает подключившимся конфигурацию игры `Game`.

После старта игры, сервер рассылает состояние игрового мира `State`.

Ответ должен содержать одно из возможных действий:
+ `Move` - перемещение отрядов
+ `Ability` - специальные действия доступные типу героя бота

Описание игровых объектов можно посмотреть на сайте [IT-God 2020](https://it-god.ru/).

### 3.1. Настройка типового приложения

Для отладки бота локально в типовом приложении нужно скопировать параметры BOTID и USERID в окне редактирования бота и добавить их в файл `index.js` для соответствующих переменных, например:

    const BOTID = "0a1468d1-c1b6-4df9-8ddf-1cd125be93ed";
    const USERID = "41b4207-1365-4a6f-a8bc-ac18f2e988f6";

Или использовать их в качестве аргументов при запуске приложения из командной строки.

Для запуска в докере, создай образ из Dockerfile в составе проекта и смонтируй контейнер.

### 3.2. Запуск приложения для отладки

Создай новую игру. Можно выбрать любую. Выбрав игру, нажми кнопку `применить`. В окне игрового лобби важно оставить один слот свободным. Именно к этому слоту будет подключаться твой бот.

После того, как открылось окно игрового лобби, запусти типовое приложение в среде разработки (из консоли или докера). Процесс подключения к игре отражается в консоли. Как только в консоли отобразится `>>> GAME READY <<<`, перейдите в игру. В окне игрового лобби ты увидишь своего бота - нажимай `Начать бой` и после некоторой паузы игра начнется ...

если после запуска проекта в консоли не отобразилось `>>> GAME READY <<<` - перезапусти проект.

Пример запуска приложения из консоли или IDE, если параметры заданы в файле `index.js` и в командной строке:

    node index
    node index -u "41b4207-1365-4a6f-a8bc-ac18f2e988f6" -b "0a1468d1-c1b6-4df9-8ddf-1cd125be93ed"

Для запуска приложения в контейнере докера, создай образ из Dockerfile проекта и запусти контейнер. Ты можешь зайти в контейнер, или запустить приложение через docker.

Пример запуска приложения в докере в фоновом режиме:

    docker exec -d 0392a94d94ca node index -i "wss://gameapi.it-god.ru" -u "41b4207-1365-4a6f-a8bc-ac18f2e988f6" -b "0a1468d1-c1b6-4df9-8ddf-1cd125be93ed"

Пример запуска приложения в докере c отображением консоли:

    docker exec -it 630b2fe38a91 bash

Параметры запуска приложения:

+ -i (--ip) - ip адрес игрового сервера
+ -u (--user) - идентификатор пользователя
+ -b (--bot) - идентификатор бота

Если параметры запуска отсутствуют в командной строке, то берутся значения из файла `index.js`.

**Важно!** Не стоит забывать про буферизацию ввода/вывода в используемом инструментарии (например, интерпретатору node.js нужно передать флаг `-u` или выставить соответствующую переменную окружения). Без этого корректная работа не гарантируется.

Важно! Не отправляй за тик боле 40 действий, чтобы избежать блокировки учетной записи.

3.3. Загрузка бота на сервер
Когда твой бот готов к испытаниям, обнови содержимое окна редактора бота на содержимое файла `bot.js` и сохрани бота. Теперь ты можешь участвовать в сражениях.

> В файле стратегии должны отсутствовать логеры, иначе поведение твоей стратегии будет отличаться от поведения на сервере

### 3.4. Включение библиотек - по запросу

В типовом проекте доступны стандартные библиотеки, библиотека для разбора JSON, реализации протокола WebSocket.

Для включения дополнительных библиотек необходимо обратиться к организаторам игры.

## 4. Стенды для разработчика

Для разработки и отладки типового приложения на вашем языке рекомендуем использовать тестовый стенд:

https://ift.game.it-god.ru/ - сама игра, здесь нужно зарегистрироваться, создать бота, получить userId, botId
wss://ift.gameapi.it-god.ru – адрес сокета

Для разработки ботов рекомендуем использовать пром стенд:
https://game.it-god.ru
wss://gameapi.it-god.ru

## 5. Создание бота на своем языке

Выбор языка программирования для реализации бота ограничен поддержкой языком протокола WebSocket.

Если ты хочешь использовать свой любимый язык программирования, и он поддерживает протокол WebSocket, тебе необходимо разработать на этом языке приложение для взаимодействия с игровой платформой и Dockerfile с параметрами создания, необходимого для его выполнения окружения.

В качестве образца можно взять любой проект, предлагаемый для отладки бота.

Разработанное приложение нужно предоставить организаторам игры, как ZIP-архив на ревью. При положительном решении, поддержка твоего языка будет добавлена в игровую платформу, а проект будет доступен в примерах для скачивания.

Требования к приложению:
+ стратегия бота должна быть реализована в одном файле размером не более 5 Мб и запускаться отдельным процессом,
+ в боте должна быть реализована простая типовая стратегия, по аналогии с проектами, предлагаемыми для отладки бота,
+ наличие Dockerfile с параметрами создания необходимого окружения для запуска и работы приложения,
+ поддерживать запуск из командной строки со следующими параметрами:
++ -i (--ip) - ip адрес игрового сервера
++ -u (--user) - идентификатор пользователя
++ -b (--bot) - идентификатор бота
+ корректный синтаксис
+ корректное подключение других модулей/пакетов выбранного языка