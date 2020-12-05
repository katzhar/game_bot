import { Mag, Warrior, BlackSmith, HeroType } from './hero.js';

export class PLayer {
  /* Класс с необходимой информацией об иргроках */
  constructor(player_color, hero_type) {
    this.player_color = player_color;
    this.hero_type = hero_type
  }
}

export class Teams {
  /* Класс игровых команд */
  my_team = [];  // массив игроков моей команды
  enemy_team = [];  // массив игроков команд противников

  constructor(game) {
    this.teams = [...game.Teams];
    if (game["HeroType"] === HeroType.Mag)
      this.my_her = new Mag(game);
    if (game["HeroType"] === HeroType.Warrior)
      this.my_her = new Warrior(game);
    if (game["HeroType"] === HeroType.BlackSmith)
      this.my_her = new BlackSmith(game);
    let my_team_id = this.__get_team_id(this.my_her.player_color)
    this.teams.forEach((team) => {
      team.Players.forEach((player) => {
        if (team.TeamId === my_team_id)
          this.my_team = [...this.my_team, new PLayer(player["PlayerColor"], player["HeroType"])]
        else
          this.enemy_team = [...this.enemy_team, new PLayer(player["PlayerColor"],
            player["HeroType"])];
      })
    })
  }

  my_team_players_color = () => {
    /* Возвращает массив цветов игроков команды моего бота */
    let result = [];
    this.my_team.forEach((player) =>
      result = [...result, player.player_color])
    return result;
  }

  enemy_players_have_hero = (hero_type) => {
    /* Возвращает True если в команде противника найден тип героя hero_type */
    let res = null;
    this.enemy_team.forEach((player) => {
      if (player.hero_type === hero_type)
        res = player;
    })
    return res;
  }

  get_team_colors_by_color = (player_color) => {
    /* Возвращает массив игроков команды игрока player_color */
    let team_id = this.__get_team_id(player_color);
    let result = []
    this.teams.forEach((team) => {
      team.Players.forEach((player) => {
        if (team["TeamId"] === team_id)
          result = [...result, player["PlayerColor"]]
      })
    })
    return result;
  }

  __get_team_id = (player_color) => {
    /* Возвращает идентификатор команды бота игрока player_color */
    let res = null;
    this.teams.forEach((team) => {
      team.Players.forEach((player) => {
        if (player.PlayerColor === player_color)
          res = team.TeamId;
      })
    })
    return res;
  }
}

// const hero = {
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
//     {
//       'TeamId': 1,
//       'Players': [
//         {
//           'TeamId': 1,
//           'PlayerColor': 1,
//           'HeroType': 3,
//         },
//         {
//           'TeamId': 1,
//           'PlayerColor': 1,
//           'HeroType': 2,
//         },
//       ],
//     },
//   ],
// }
//
// const test = new Teams(hero);
// console.log(test);
