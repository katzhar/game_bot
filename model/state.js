const { Ability } = require('./abilites.js');
const { Building, BuildingType } = require('./buildings.js');
const { Squad } = require('./squads.js');
const { Cooldown } = require('./cooldowns.js');

 class State {
  /* Класс, предоставляющий доступ к состоянию игры */
  constructor(state, teams, parameters) {
    this.state = JSON.parse(state);
    this.__player_color = teams.my_her.player_color;
    this.__my_team_players_color = teams.my_team_players_color();

    // получаем список всех зданий
    this.buildings = [];
    this.state.buildingStates.forEach((building) => {
      this.buildings = [...this.buildings, new Building(building, parameters)];
    });
    // получаем список всех отрядов
    this.squads = [];
    this.state.squadStates.forEach((squad) => {
      this.squads = [...this.squads, new Squad(squad)];
    });
    // получаем список всех примененных абилок
    this.abilities = [];
    this.state.AbilityStates.forEach((ability) => {
      this.abilities = [...this.abilities, new Ability(ability)];
    });
    // получаем список всех фризов на применение абилок
    this.cooldowns = [];
    this.state.CooldownState.forEach((cooldown) => {
      this.cooldowns = [...this.cooldowns, new Cooldown(cooldown)];
    });
    // глобальный бафф который происходит побитовая маска
    this.global_buffs_mask = this.state.GlobalBuffsMask;

    // получаем список кузниц
    this.forges = this.buildings.filter((x) => x.type === BuildingType.Forge);

    // добавление бонуса защиты для башен игрока, владеющего кузницей
    this.forges.forEach((forg) => {
      let team_colors = teams.get_team_colors_by_color(forg.player_color);
      if (team_colors.length > 0) {
        this.buildings = this.buildings.filter((x) => {
          x.type !== BuildingType.Forge
            && team_colors.includes(x.player_color)
        });
        this.buildings.forEach((building) => {
          building.add_defence(parameters.forge.defence_bonus);
        })
      }
    })
  }

  my_buildings = () => {
    // Мои здания
    return this.buildings.filter((x) => x.type === BuildingType.Tower
      && x.player_color === this.__player_color);
  };

  enemy_buildings = () => {
    // Вражеские здания
    return this.buildings.filter((x) => {
      !this.__my_team_players_color.includes(x.player_color) &&
        x.player_color !== 0 && x.type === BuildingType.Tower
    })
  };

  neutral_buildings = () => {
    // Нейтральные здания
    return this.buildings.filter((x) =>
      x.player_color === 0 && x.type === BuildingType.Tower);
  };

  forges_buildings = () => {
    // Кузницы
    return this.buildings.filter((x) => x.type === BuildingType.Forge);
  };

  my_squads = () => {
    // Мои отряды
    return this.squads.filter((x) => x.player_color === this.__player_color);
  };

  enemy_squads = () => {
    // Вражеские отряды
    return this.squads.filter((x) =>
      !this.__my_team_players_color.includes(x.player_color));
  };

  my_active_abilities = () => {
    // Мои возможности активные в текущем стейте
    return this.abilities.filter((x) => x.player_color === this.__player_color);
  };

  enemy_active_abilities = (ability) => {
    // Активные абилки примененные врагом
    const includesPlColor = !this.__my_team_players_color.includes(x.player_color);
    if (ability) {
      return this.abilities.filter((x) => {
        includesPlColor && x.ability === ability
      });
    } else {
      return this.abilities.filter((x) =>
        includesPlColor);
    }
  };

  ability_ready = (ability) => {
    // Готовность к повторному применению
    let res = true;
    this.cooldowns.forEach((cool_down) => {
      if (cool_down.player_color === this.__player_color
        && cool_down.ability === ability)
        res = false;
    });
    return res;
  }
}

// const state = JSON.stringify({
//   "squadStates": [ //Список состояний отрядов крипов на карте
//     {
//       "FromId": 14, //ID строения, из которого были посланы крипы
//       "ToId": 18, //ID строения, в которое были посланы крипы
//       "StartCreepsCount": 4, //Начальное количество крипов в отряде
//       "PlaceMask": 15, //Маска расположения текущих крипов внутри отряда
//       "BuffMask": 0, //Маска бафов / дебафов каждого крипа.
//       "Speed": 0.0459999964, //Расстояние, которое проходит данный отряд крипов за 1 тик
//       "Way": {
//         "Traveled": 6.995996, //Часть пути, которое прошли крипы в текущий момент в абсолютных значениях
//         "Total": 7.03213453 //Длина пути данного отряда крипов в абсолютных значениях
//       },
//       "Id": 2, //Внутриигровой ID юнита
//       "PlayerColor": 2, //Внутриигровая команда юнита
//       "CreepsCount": 4 //Количество крипов в юните
//     },
//     {
//       "FromId": 14,
//       "ToId": 18,
//       "StartCreepsCount": 4,
//       "PlaceMask": 15,
//       "BuffMask": 0,
//       "Speed": 0.0459999964,
//       "Way": {
//         "Traveled": 6.59599638,
//         "Total": 7.03213453
//       },
//       "Id": 3,
//       "PlayerColor": 2,
//       "CreepsCount": 4
//     }
//   ],
//   "buildingStates": [ //Список состояний строений на карте
//     {
//       "Type": 1, //Тип строения(см сопоставление типов строений ниже)
//       "Level": 0, //Текущий уровень строения
//       "CreepCreationTime": 10, //Время создания крипов в данном строении
//       "DefenseBonus": 0.0, //Добавочный показатель защиты данного строения
//       "BuffMask": 0, //Маска, показывающая действие эффектов на данное строение
//       "Id": 3, //Внутриигровой ID юнита
//       "PlayerColor": 0, //Внутриигровая команда юнита
//       "CreepsCount": 10 //Количество крипов в юните
//     },
//     {
//       "Type": 1,
//       "Level": 0,
//       "CreepCreationTime": 10,
//       "DefenseBonus": 0.0,
//       "BuffMask": 0,
//       "Id": 4,
//       "PlayerColor": 0,
//       "CreepsCount": 10
//     }
//   ],
//   "AbilityStates": [ //Список состояний спеллов на карте
//     {
//       "AbilityInputType": 0, //Тип применения заклинания
//       "Ability": 8, //Идентификатор заклинания
//       "OwnerColor": 0, //Цвет игрока, который произнес заклинание
//       "InitialTick": 826, //Номер тика, на котором заклинание было произнесено
//       "StartTick": 827, //Номер тика, на котором заклинание начало/ начнет свое действие
//       "EndTick": 827 //Номер тика, на котором заклинание прекращает
//     },
//     {
//       "AbilityInputType": 1,
//       "Ability": 8,
//       "OwnerColor": 0,
//       "InitialTick": 826,
//       "StartTick": 827,
//       "EndTick": 827,
//       "X": 0.123, //Х координата области действия заклинания(наличие поля зависит от параметра AbilityInputType)
//       "Y": -2.746 //Y координата области действия заклинания(наличие поля зависит от параметра AbilityInputType)
//     },
//     {
//       "AbilityInputType": 2,
//       "Ability": 8,
//       "OwnerColor": 0,
//       "InitialTick": 826,
//       "StartTick": 827,
//       "EndTick": 827,
//       "TargetTowerId": 0 //ID строения, на которое произнесено заклинание(наличие поля зависит от параметра AbilityInputType)
//     },
//     {
//       "AbilityInputType": 1,
//       "Ability": 8,
//       "OwnerColor": 0,
//       "InitialTick": 826,
//       "StartTick": 827,
//       "EndTick": 827,
//       "FirstTargetTowerId": 1, //ID первого строения, на которое произнесено заклинание(наличие поля зависит от параметра AbilityInputType)
//       "SecondTargetTowerId": 2 //ID второго строения, на которое произнесено заклинание(наличие поля зависит от параметра AbilityInputType)
//     }
//   ],
//   "CooldownState": [ //Список состояний кулдаунов способностей.Если способности нет в списке, значит ее можно использовать
//     {
//       "PlayerColor": 2, //Цвет владелца заклинания
//       "Ability": 7, //Индетификатор заклинания
//       "TicksToCooldownEnd": 12 //Оставшееся время в тиках до окончания задержки заклинания
//     }
//   ],
//   "Tick": 827, //Номер текущего тика
//   "GlobalBuffsMask": 12, //Маска показывающая наличие / отсутствие действий глобальных эффектов
//   "ResponseGameParametersArgs": {
//     "Parameters": {
//       "Duration": 6000, //Продолжительность битвы в тиках
//       "DefaultDefenseParameter": 1.1, //Стандартный множитель защиты здания при атаке вражеской команды
//       "Forges": { //Настройки кузниц на карте
//         "DefenseBonus": 0.1, //Прибавка к множителю защиты для команды, владеющей кузницей
//         "DefaultPlayerCount": 10, //Количество крипов в строении в начале битвы, если оно принадлежит команде игрока
//         "DefaultNeutralCount": 50, //Количество крипов в строении в начале битвы, если оно принадлежит нейтральной команде
//         "PlayerMaxCount": 20, //Максимальное количество крипов в строении, если оно принадлежит команде игрока
//         "NeutralMaxCount": 50 //Максимальное количество крипов в строении, если оно принадлежит нейтральной команде
//       },
//       "Towers": { //Настройки башен на карте. Ключ - уровень башни
//         "0": { //Настройки башен первого уровня
//           "UpdateCoast": 0, //Стоимость перехода на данный уровень башни в крипах
//           "DefenseBonus": 0.0, //Дополнительная защита башни на данном уровне
//           "CreepCreationTime": 10, //Задержка создания 1 крипа в башне данного уровня в тиках
//           "DefaultPlayerCount": 100, //Количество крипов в строении в начале битвы, если оно принадлежит команде игрока
//           "DefaultNeutralCount": 5, //Количество крипов в строении в начале битвы, если оно принадлежит нейтральной команде
//           "PlayerMaxCount": 20, //Максимальное количество крипов в строении, если оно принадлежит команде игрока
//           "NeutralMaxCount": 10 //Максимальное количество крипов в строении, если оно принадлежит нейтральной команде
//         },
//         "1": { //Настройки башен второго уровня
//           "UpdateCoast": 15,
//           "DefenseBonus": 0.1,
//           "CreepCreationTime": 6,
//           "DefaultPlayerCount": 0,
//           "DefaultNeutralCount": 5,
//           "PlayerMaxCount": 25,
//           "NeutralMaxCount": 20
//         },
//         "2": { //Настройки башен третьего уровня
//           "UpdateCoast": 20,
//           "DefenseBonus": 0.2,
//           "CreepCreationTime": 4,
//           "DefaultPlayerCount": 0,
//           "DefaultNeutralCount": 5,
//           "PlayerMaxCount": 30,
//           "NeutralMaxCount": 30
//         }
//       },
//       "Creeps": { //Настройки крипов на карте
//         "Speed": 0.04, //Скорость перемещения крипов
//         "WaveDelay": 10, //Время между волнами крипов в тиках
//         "MaxWaveCreepsCount": 4, //Максимальное кол-во крипов в 1 волне
//         "CreepInWaveDistance": 0.2 //Расстояние между крипами в 1 волне
//       },
//       "AbilitiesParameters": { //Настройки абилок на карте
//         "abilities": [ //Масив настроек способностей, доступных на данной карте
//           {
//             "Id": 0, //Идентификатор способности (см сопоставления идентификаторов способностей ниже)
//             "InputType": 1, //Тип способности (см сопоставления типов способностей ниже)
//             "Duration": 0, //Продолжительность действия способности
//             "Cooldown": 50, //Задержка перед повторным использованием способности в тиках
//             "CastTime": 0, //Время в тиках, которое должно пройти от применения способности до начала ее действия
//             "Radius": 1.3, //Радиус действия способности. Актуально для способностей с InputType = 1
//             "AbilityData": { //Набор параметров, уникальный для каждой способности
//               "SpeedModifier": 1.3, //Модификатор скорости крипов
//             }
//           },
//           {
//             "Id": 1,
//             "InputType": 0,
//             "Duration": 40,
//             "Cooldown": 80,
//             "CastTime": 0,
//             "Radius": 0.0,
//             "AbilityData": {}
//           },
//           {
//             "Id": 2,
//             "InputType": 1,
//             "Duration": 0,
//             "Cooldown": 50,
//             "CastTime": 0,
//             "Radius": 1.3,
//             "AbilityData": {
//               "AttackModifier": 3.0 //Модификатор атаки крипов
//             }
//           },
//           {
//             "Id": 3,
//             "InputType": 2,
//             "Duration": 0,
//             "Cooldown": 10,
//             "CastTime": 20,
//             "Radius": 0.0,
//             "AbilityData": {
//               "UnitPercent": 0.6, //Процент крипов, покидающих башню, не защищенную способностью "Щит"
//               "UnitPercentWithShield": 0.4 //Процент крипов, покидающих башню, защищенную способностью "Щит"
//             }
//           },
//           {
//             "Id": 4,
//             "InputType": 1,
//             "Duration": 0,
//             "Cooldown": 50,
//             "CastTime": 20,
//             "Radius": 1.3,
//             "AbilityData": {
//               "MinimumDamage": 15, //Нижняя граница наносимого урона в крипах
//               "MaximumDamage": 30 //Верхняя граница наносимого урона в крипах
//             }
//           },
//           {
//             "Id": 5,
//             "InputType": 2,
//             "Duration": 30,
//             "Cooldown": 50,
//             "CastTime": 0,
//             "Radius": 0.0,
//             "AbilityData": {
//               "DamagePerTick": 0.1, //Урон в 1 тик способности, если строение не защищено способностью "щит". Измеряется в процентах войск в башне на момент тика.
//               "DamagePerTickWithShield": 0.06, //Урон в 1 тик способности, если строение защищено способностью "щит". Измеряется в процентах войск в башне на момент тика.
//               "TickDelay": 3 //Время в тиках, необходимое для тика способности
//             }
//           },
//           {
//             "Id": 6,
//             "InputType": 3,
//             "Duration": 0,
//             "Cooldown": 80,
//             "CastTime": 3,
//             "Radius": 0.0,
//             "AbilityData": {}
//           },
//           {
//             "Id": 7,
//             "InputType": 2,
//             "Duration": 20,
//             "Cooldown": 40,
//             "CastTime": 0,
//             "Radius": 0.0,
//             "AbilityData": {
//               "DefenceBonus": 0.2 //Дополнительный бонус защиты строения
//             }
//           },
//           {
//             "Id": 8,
//             "InputType": 0,
//             "Duration": 0,
//             "Cooldown": 0,
//             "CastTime": 1,
//             "Radius": 0.0,
//             "AbilityData": {
//               "TowersDeadZoneRadius": 1.0 //Радиус "мертвой зоны" вокруг строения, где червь не способен атаковать крипов
//             }
//           },
//           {
//             "Id": 9,
//             "InputType": 0,
//             "Duration": 0,
//             "Cooldown": 0,
//             "CastTime": 0,
//             "Radius": 0.0,
//             "AbilityData": {
//               "SpeedBuffPercent": 0.15 //Процент, на которой увеличивается скорость крипов
//             }
//           }
//         ]
//       },
//       "GameEventsParameters": [ //Настройки глобальных событий
//         {
//           "StartTick": 600, //Начальный тик действия глобального события
//           "LoopInterval": 50, //Интервал, с которым событие повторяется
//           "LoopMode": 1, //Режим повторения события (см сопоставления режимов повторения событий ниже)
//           "UseMode": 0, //Режим применения события (см сопоставления режимов применения событий ниже)
//           "Ability": 8, //Индетификатор способности, используемой в качестве события
//           "TargetColor": 0 //Цвет игрока, на который направлена способность. Актуально при UseMode = 0. (см сопоставления цветов игрока ниже)
//         },
//         {
//           "StartTick": 800,
//           "LoopInterval": 0,
//           "LoopMode": 0,
//           "UseMode": 1,
//           "Ability": 9,
//           "TargetColor": 0
//         }
//       ]
//     }
//   }
// });

// const teams = JSON.stringify({
//   'HeroType': 3,
//   'PlayerColor': 1,
//   'Teams': [{
//     'TeamId': 2,
//     'Players': [
//       {
//         'TeamId': 2,
//         'PlayerColor': 2,
//         'HeroType': 1,
//       },
//       {
//         'TeamId': 2,
//         'PlayerColor': 2,
//         'HeroType': 3,
//       },
//     ],
//   },
//   {
//     'TeamId': 1,
//     'Players': [
//       {
//         'TeamId': 1,
//         'PlayerColor': 1,
//         'HeroType': 3,
//       },
//       {
//         'TeamId': 1,
//         'PlayerColor': 1,
//         'HeroType': 2,
//       },
//     ],
//   },
//   ],
// });

// const game_params = new Parameters(state);  // параметры игры
// const game_teams = new Teams(state);  // моя команда

// const test = new State(state, game_teams, game_params);

module.exports.State = State;
