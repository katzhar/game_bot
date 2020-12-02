/*Типы башен*/
const BuildingType = [
  'Tower', // обычная башня
  'Forge',  // кузница
]

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
    this.level = parameters.get_tower_level[building.Level]; // текущий уровень башни
  }
  add_defence = (defence_bonus) => {
    this.DefenseBonus += defence_bonus;
  }
}