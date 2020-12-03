import {Ability, AbilityType} from './abilites';
import {Building, BuildingType} from './buildings';
import {Squad} from './squads';
import {Cooldown} from './cooldowns';

class State {
  // Класс, предоставляющий доступ к состоянию игры
  constructor(state, teams, parameters) {
    this.state = json.parse(state);
    this.__player_color = teams.my_her.player_color;
    this.__my_team_players_color = teams.my_team_players_color();

    // получаем список всех зданий
    this.buildings = [];
    for (let building in this.state["State"]["buildingStates"]) {
      this.buildings = [...this.buildings, new Building(building, parameters)];
    }
    // получаем список всех отрядов
    this.squads = [];
    for (let squad in this.state["State"]["squadStates"]) {
      this.squads = [...this.squads, new Squad(squad)];
    }
    // получаем список всех примененных абилок
    this.abilities = [];
    for (let ability in this.state["State"]["AbilityStates"]) {
      this.abilities = [...this.abilities, new Ability(ability)];
    }
    // получаем список всех фризов на применение абилок
    this.cooldowns = [];
    for (let cooldown in this.state["State"]["CooldownState"]) {
      this.cooldowns = [...this.cooldowns, new Cooldown(cooldown)];
    }
    // глобальный бафф который происходит побитовая маска
    this.global_buffs_mask = this.state["State"]["GlobalBuffsMask"];

    // получаем список кузниц
    this.forges = this.buildings.filter((x) => x.type === BuildingType.Forge)
    this.forges = this.buildings.map((x) => {
      return x.type === BuildingType.Forge;
    })

    // добавление бонуса защиты для башен игрока владеющего кузницей
    for (let forg in this.forges) {
      let team_colors = teams.get_team_colors_by_color(forg.player_color);
      if (team_colors.length > 0) {
        this.buildings.map((x) => {
          if (x.type !== BuildingType.Forge
            && team_colors.includes(x.player_color)) {
            building.add_defence(parameters.forge.defence_bonus);
          }
        })
      }
    }
  }

  my_buildings = () => {
    // Мои здания
    this.buildings.map((x) => {
      return (x.type === BuildingType.Tower
        && x.player_color === this.__player_color)
    })
  }

  enemy_buildings = () => {
    // Вражеские здания
    this.buildings.map((x) => {
      if (!this.__my_team_players_color.includes(x.player_color)) {
        return (x.player_color !== 0
          && x.type === BuildingType.Tower)
      }
    })
  }

  neutral_buildings = () => {
    // Нейтральные здания
    this.buildings.map((x) => {
      return (x.player_color === 0
        && x.type === BuildingType.Tower);
    })
  }

  forges_buildings = () => {
    // Кузницы
    this.buildings.map((x) => {
      return x.type === BuildingType.Forge;
    })
  }

  my_squads = () => {
    // Мои отряды
    this.squads.map((x) => {
      return x.player_color === this.__player_color;
    })
  }

  enemy_squads = () => {
    // Вражеские отряды
    this.squads.map((x) => {
      if (!this.__my_team_players_color.includes(x.player_color)) {
        return this.squads;
      }
    })
  }
  enemy_squads = () => {
    // Вражеские отряды
    this.squads.filter((x) => {
      if (!this.__my_team_players_color.includes(x.player_color)) {
        return this.squads;
      }
    })
  }


  my_active_abilities = () => {
    // Мои возможности активные в текущем стейте
    this.abilities.map((x) => {
      return x.player_color === this.__player_color;
    })
  }

  enemy_active_abilities = (ability) => {
    // Активные абилки примененные врагом
    if (ability) {
      this.abilities.map((x) => {
        if (!this.__my_team_players_color.includes(x.player_color)) {
          return x.ability === ability;
        }
      })
    } else {
      this.abilities.map((x) => {
        if (!this.__my_team_players_color.includes(x.player_color)) {
          return this.abilities;
        }
      })
    }
  }

  ability_ready = (ability) => {
    // Готовность к повторному применению
    for (let cool_down in this.cooldowns) {
      if (cool_down.player_color === this.__player_color
        && cool_down.ability === ability)
        return false;
    }
    return true;
  }
}