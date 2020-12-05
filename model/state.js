import { Ability } from './abilites.js';
import { Building, BuildingType } from './buildings.js';
import { Squad } from './squads.js';
import { Cooldown } from './cooldowns.js';
export class State {
  /* Класс, предоставляющий доступ к состоянию игры */
  constructor(state, teams, parameters) {
    this.state = JSON.parse(state);
    this.__player_color = teams.my_her.player_color;
    this.__my_team_players_color = teams.my_team_players_color();

    // получаем список всех зданий
    this.buildings = [];
    this.state["State"]["buildingStates"].forEach((building) => {
      this.buildings = [...this.buildings, new Building(building, parameters)];
    })
    // получаем список всех отрядов
    this.squads = [];
    this.state["State"]["squadStates"].forEach((squad) => {
      this.squads = [...this.squads, new Squad(squad)];
    })
    // получаем список всех примененных абилок
    this.abilities = [];
    this.state["State"]["AbilityStates"].forEach((ability) => {
      this.abilities = [...this.abilities, new Ability(ability)];
    })
    // получаем список всех фризов на применение абилок
    this.cooldowns = [];
    this.state["State"]["CooldownState"].forEach((cooldown) => {
      this.cooldowns = [...this.cooldowns, new Cooldown(cooldown)];
    })
    // глобальный бафф который происходит побитовая маска
    this.global_buffs_mask = this.state["State"]["GlobalBuffsMask"];

    // получаем список кузниц
    this.forges = this.buildings.filter((x) => x.type === BuildingType.Forge);

    // добавление бонуса защиты для башен игрока владеющего кузницей
    this.forges.forEach((forg) => {
      let team_colors = teams.get_team_colors_by_color(forg.player_color);
      if (team_colors.length > 0) {
        this.buildings = this.buildings.filter((x) => {
          x.type !== BuildingType.Forge
            && team_colors.includes(x.player_color)
        })
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
  }

  enemy_buildings = () => {
    // Вражеские здания
    return this.buildings.filter((x) => {
      !this.__my_team_players_color.includes(x.player_color) &&
        x.player_color !== 0 && x.type === BuildingType.Tower
    })
  }

  neutral_buildings = () => {
    // Нейтральные здания
    return this.buildings.filter((x) =>
      x.player_color === 0 && x.type === BuildingType.Tower);
  }

  forges_buildings = () => {
    // Кузницы
    return this.buildings.filter((x) => x.type === BuildingType.Forge);
  }

  my_squads = () => {
    // Мои отряды
    return this.squads.filter((x) => x.player_color === this.__player_color);
  }

  enemy_squads = () => {
    // Вражеские отряды
    return this.squads.filter((x) =>
      !this.__my_team_players_color.includes(x.player_color));
  }

  my_active_abilities = () => {
    // Мои возможности активные в текущем стейте
    return this.abilities.filter((x) => x.player_color === this.__player_color);
  }

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
  }

  ability_ready = (ability) => {
    // Готовность к повторному применению
    let res = true;
    this.cooldowns.forEach((cool_down) => {
      if (cool_down.player_color === this.__player_color
        && cool_down.ability === ability)
        res = false;
    })
    return res;
  }
}


const params = JSON.stringify({
  "squadStates": [ //Список состояний отрядов крипов на карте
    {
      "FromId": 14, //ID строения, из которого были посланы крипы
      "ToId": 18, //ID строения, в которое были посланы крипы
      "StartCreepsCount": 4, //Начальное количество крипов в отряде
      "PlaceMask": 15, //Маска расположения текущих крипов внутри отряда
      "BuffMask": 0, //Маска бафов / дебафов каждого крипа.
      "Speed": 0.0459999964, //Расстояние, которое проходит данный отряд крипов за 1 тик
      "Way": {
        "Traveled": 6.995996, //Часть пути, которое прошли крипы в текущий момент в абсолютных значениях
        "Total": 7.03213453 //Длина пути данного отряда крипов в абсолютных значениях
      },
      "Id": 2, //Внутриигровой ID юнита
      "PlayerColor": 2, //Внутриигровая команда юнита
      "CreepsCount": 4 //Количество крипов в юните
    },
    {
      "FromId": 14,
      "ToId": 18,
      "StartCreepsCount": 4,
      "PlaceMask": 15,
      "BuffMask": 0,
      "Speed": 0.0459999964,
      "Way": {
        "Traveled": 6.59599638,
        "Total": 7.03213453
      },
      "Id": 3,
      "PlayerColor": 2,
      "CreepsCount": 4
    }
  ],
  "buildingStates": [ //Список состояний строений на карте
    {
      "Type": 1, //Тип строения(см сопоставление типов строений ниже)
      "Level": 0, //Текущий уровень строения
      "CreepCreationTime": 10, //Время создания крипов в данном строении
      "DefenseBonus": 0.0, //Добавочный показатель защиты данного строения
      "BuffMask": 0, //Маска, показывающая действие эффектов на данное строение
      "Id": 3, //Внутриигровой ID юнита
      "PlayerColor": 0, //Внутриигровая команда юнита
      "CreepsCount": 10 //Количество крипов в юните
    },
    {
      "Type": 1,
      "Level": 0,
      "CreepCreationTime": 10,
      "DefenseBonus": 0.0,
      "BuffMask": 0,
      "Id": 4,
      "PlayerColor": 0,
      "CreepsCount": 10
    }
  ],
  "AbilityStates": [ //Список состояний спеллов на карте
    {
      "AbilityInputType": 0, //Тип применения заклинания
      "Ability": 8, //Идентификатор заклинания
      "OwnerColor": 0, //Цвет игрока, который произнес заклинание
      "InitialTick": 826, //Номер тика, на котором заклинание было произнесено
      "StartTick": 827, //Номер тика, на котором заклинание начало/ начнет свое действие
      "EndTick": 827 //Номер тика, на котором заклинание прекращает 
    },
    {
      "AbilityInputType": 1,
      "Ability": 8,
      "OwnerColor": 0,
      "InitialTick": 826,
      "StartTick": 827,
      "EndTick": 827,
      "X": 0.123, //Х координата области действия заклинания(наличие поля зависит от параметра AbilityInputType)
      "Y": -2.746 //Y координата области действия заклинания(наличие поля зависит от параметра AbilityInputType)
    },
    {
      "AbilityInputType": 2,
      "Ability": 8,
      "OwnerColor": 0,
      "InitialTick": 826,
      "StartTick": 827,
      "EndTick": 827,
      "TargetTowerId": 0 //ID строения, на которое произнесено заклинание(наличие поля зависит от параметра AbilityInputType)
    },
    {
      "AbilityInputType": 1,
      "Ability": 8,
      "OwnerColor": 0,
      "InitialTick": 826,
      "StartTick": 827,
      "EndTick": 827,
      "FirstTargetTowerId": 1, //ID первого строения, на которое произнесено заклинание(наличие поля зависит от параметра AbilityInputType)
      "SecondTargetTowerId": 2 //ID второго строения, на которое произнесено заклинание(наличие поля зависит от параметра AbilityInputType)
    }
  ],
  "CooldownState": [ //Список состояний кулдаунов способностей.Если способности нет в списке, значит ее можно использовать
    {
      "PlayerColor": 2, //Цвет владелца заклинания
      "Ability": 7, //Индетификатор заклинания
      "TicksToCooldownEnd": 12 //Оставшееся время в тиках до окончания задержки заклинания
    }
  ],
  "Tick": 827, //Номер текущего тика
  "GlobalBuffsMask": 12 //Маска показывающая наличие / отсутствие действий глобальных эффектов
})

const test = new State(params);
console.log(test);
