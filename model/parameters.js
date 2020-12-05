import { AbilityParameters, GameEventParameters } from './abilites.js';
import { TowerLevelParameters, ForgeParameters } from './buildings.js';
import { CreepParameters } from './squads.js';

export class Parameters {
  // Класс, предоставляющий доступ к параметрам игры
  constructor(game) {
    let parameters = JSON.parse(game);
    parameters = parameters.ResponseGameParametersArgs.Parameters;
    // максимальная продолжительность игры в тиках
    this.duration = parameters["Duration"]
    // защита башен по умолчанию
    this.default_defence_parameters = parameters["DefaultDefenseParameter"]
    // уровни башен
    this.tower_levels = []
    for (let tower in parameters["Towers"])
      this.tower_levels = [...this.tower_levels, new TowerLevelParameters(+tower,
        parameters["Towers"][tower])]
    // параметры кузницы
    this.forge = new ForgeParameters(parameters["Forges"])
    // параметры крипов
    this.creep = new CreepParameters(parameters["Creeps"])
    // параметры абилок
    this.abilities = []
    parameters.AbilitiesParameters.abilities.forEach((ability) => {
      // параметры глобальных игровых событий
      this.abilities = [...this.abilities, new AbilityParameters(ability)]
    })
    this.game_events = []
    parameters["GameEventsParameters"].forEach((game_event) =>
      this.game_events = [...this.game_events, new GameEventParameters(game_event)],
    )
  }

  get_tower_level = (level) => {
    // Возвращает параметры уровня башни level
    let res = null;
 this.tower_levels.forEach((tower_level) =>{
      if (tower_level.id === level)
        res = tower_level;
    })
    return res;
  }

  get_ability_parameters = (Ability) => {
    // Возвращает параметры уровня башни level
    let res = null;
    this.abilities.forEach((item) => {
      if (item.ability === Ability)
        res = item;
    })
    return res;
  }
}


// const params = JSON.stringify( {
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
// })

