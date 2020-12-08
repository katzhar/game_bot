/*Типы башен*/
  const BuildingType = [
  'Tower', // обычная башня
  'Forge',  // кузница
];
  class Building {
  /*Состояние башен. Передается в игровом стейте*/
  constructor(building, parameters) {
    this.id = building.Id; // идентификатор башни
    this.type = BuildingType[building.Type]; // тип башни 1 - башня, 2 - кузница
    this.creeps_count = building.CreepsCount;  // текущее количество крипов
    this.player_color = building.PlayerColor;  // принадлежность игроку
    this.creep_creation_time = building.CreepCreationTime;  // сколько тиков создается крип
    this.buff_mask = building.BuffMask;  // побитовая маска i-й бит growl-1, plague-2, exchange-3, invision-4
    this.DefenseBonus = building.DefenseBonus; /* текущая защита*/
    // уровень от 0 до 3 определяет текущие значения башни, нужно их подтягивать откуда-то и как-то - из параметров
    this.level = parameters.get_tower_level(building.Level); // текущий уровень башни
  }

  add_defence = (defence_bonus) => {
    this.DefenseBonus += defence_bonus;
  }
}
  class TowerLevelParameters {
  /*
  Класс предоставляющий праматеры башен по уровням, которые передаются в игровых параметрах при
  инициализации игры
  */
  constructor(id, params) {
    // номер уровня
    this.id = id;
    // цена перехода
    this.update_coast = params["UpdateCoast"];
    // бонус защиты в абсолютном значении + 1
    this.defense_bonus = params["DefenseBonus"];
    // время в тиках за котрое создается 1 крип
    this.creep_creation_time = params["CreepCreationTime"];
    // начальное дефолтное занчение количества крипов для игрока
    this.default_player_count = params["DefaultPlayerCount"];
    // начальное дефолтное занчение количества крипов для нейтрального
    this.default_neutral_count = params["DefaultNeutralCount"];
    // максимальное количество крипов для игрока после которого останавливается рост
    this.player_max_count = params["PlayerMaxCount"];
    // максимальное количество крипов для нейтрального игрока после которого останавливается рост
    this.neutral_max_count = params["NeutralMaxCount"]
  }
}
  class ForgeParameters {
  /*
  Класс предоставляющий праматеры кузницы, которые передаются в игровых параметрах при
  инициализации игры
  */
  constructor(params) {
    // дает бонус к защите башен
    this.defence_bonus = params["DefenseBonus"];
    // начальное дефолтное занчение количества крипов для игрока
    this.default_player_count = params["DefaultPlayerCount"];
    // начальное дефолтное занчение количества крипов для нейтрального
    this.default_neutral_count = params["DefaultNeutralCount"];
    // максимальное количество крипов для игрока после которого останавливается рост
    this.player_max_count = params["PlayerMaxCount"];
    // максимальное количество крипов для нейтрального игрока после которого останавливается рост
    this.neutral_max_count = params["NeutralMaxCount"]
  }
}

// const buildingStates = [ //Список состояний строений на карте
//   {
//     "Type": 1, //Тип строения (см сопоставление типов строений ниже)
//     "Level": 0, //Текущий уровень строения
//     "CreepCreationTime": 10, //Время создания крипов в данном строении
//     "DefenseBonus": 0.0, //Добавочный показатель защиты данного строения
//     "BuffMask": 0, //Маска, показывающая действие эффектов на данное строение
//     "Id": 3, //Внутриигровой ID юнита
//     "PlayerColor": 0, //Внутриигровая команда юнита
//     "CreepsCount": 10 //Количество крипов в юните
//   },
//   {
//     "Type": 1,
//     "Level": 0,
//     "CreepCreationTime": 10,
//     "DefenseBonus": 0.0,
//     "BuffMask": 0,
//     "Id": 4,
//     "PlayerColor": 0,
//     "CreepsCount": 10
//   }
// ]

// const Towers = { //Настройки башен на карте. Ключ - уровень башни
//   "0": { //Настройки башен первого уровня
//     "UpdateCoast": 0, //Стоимость перехода на данный уровень башни в крипах
//     "DefenseBonus": 0.0, //Дополнительная защита башни на данном уровне
//     "CreepCreationTime": 10, //Задержка создания 1 крипа в башне данного уровня в тиках
//     "DefaultPlayerCount": 100, //Количество крипов в строении в начале битвы, если оно принадлежит команде игрока
//     "DefaultNeutralCount": 5, //Количество крипов в строении в начале битвы, если оно принадлежит нейтральной команде
//     "PlayerMaxCount": 20, //Максимальное количество крипов в строении, если оно принадлежит команде игрока
//     "NeutralMaxCount": 10 //Максимальное количество крипов в строении, если оно принадлежит нейтральной команде
//   },
//   "1": { //Настройки башен второго уровня
//     "UpdateCoast": 15,
//     "DefenseBonus": 0.1,
//     "CreepCreationTime": 6,
//     "DefaultPlayerCount": 0,
//     "DefaultNeutralCount": 5,
//     "PlayerMaxCount": 25,
//     "NeutralMaxCount": 20
//   },
//   "2": { //Настройки башен третьего уровня
//     "UpdateCoast": 20,
//     "DefenseBonus": 0.2,
//     "CreepCreationTime": 4,
//     "DefaultPlayerCount": 0,
//     "DefaultNeutralCount": 5,
//     "PlayerMaxCount": 30,
//     "NeutralMaxCount": 30
//   }
// }
