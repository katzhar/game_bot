import { Ability } from './abilites';
import { Building, BuildingType } from './buildings';
import { Squad } from './squads';
import { Cooldown } from './cooldowns';
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
        this.buildings.forEach((building) =>{
          building.add_defence(parameters.forge.defence_bonus);})
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
    const includesPlColor =!this.__my_team_players_color.includes(x.player_color);
    if (ability) {
      return this.abilities.filter((x) => {
        includesPlColor && x.ability === ability});
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
