const { HeroType } = require('./model/hero');
const { AbilityType } = require('./model/abilites');
const { State } = require('./model/state');

const { Map } = require('./model/map.js');
const { Parameters } = require('./model/parameters.js');
const { Teams } = require('./model/teams.js');


let game_map =null;
let game_params = null;
let game_teams = null;


const Bot = (game, game_teams, game_params, game_map) => {
  try {
    /* Получение состояния игры */
    if (game && game_teams && game_params) {
      const state = new State(game, game_teams, game_params);
      const my_buildings = state.my_buildings();
      const my_squads = state.my_squads();
      // сортируем по остаточному пути
      my_squads.sort(function (a, b) {
        if (a.way.left > b.way.left) {
          return 1;
        }
        if (a.way.left < b.way.left) {
          return -1;
        }
        return 0;
      });

      const enemy_buildings = state.enemy_buildings();
      const enemy_squads = state.enemy_squads();

      const neutral_buildings = state.neutral_buildings();
      const forges_buildings = state.forges_buildings();
      /* Играем за мага */

      if (game_teams.my_her.hero_type === HeroType.Mag) {
        // проверяем доступность абилки Обмен башнями
        if (state.ability_ready(AbilityType.indexOf('Build_exchange'))) {
          // если враг применил абилку обмен башнями
          const build_exchange = state.enemy_active_abilities(AbilityType.indexOf('Build_exchange'));
          if (build_exchange.length > 0)
            process.send(game_teams.my_her.exchange(enemy_buildings[0].id, my_buildings[0].id));
          else if (my_buildings[0] && my_buildings[0].creeps_count < 10)
            process.send(game_teams.my_her.exchange(enemy_buildings[0].id, my_buildings[0].id))
        }
        // проверяем доступность абилки Чума
        if (state.ability_ready(AbilityType.indexOf('Plague'))) {
          // для эффективности применяем ближе к башне
          if (my_squads.length > 1) {
            //сколько тиков первому отряду осталось до башни
            const left_to_aim = my_squads[0].way.left / my_squads[0].speed;
            // если первый отряд находится в зоне инициализации абилки
            const plague_parameters = game_params.get_ability_parameters(AbilityType.indexOf(
              'Plague'));
            if (plague_parameters.cast_time + 30 > left_to_aim)
              process.send(game_teams.my_her.plague(enemy_buildings[0].id))
          }
        }
        // атакуем башню противника
        my_buildings.forEach((my_building) => {
          if (my_building.creeps_count > my_building.level.player_max_count)
            process.send(game_teams.my_her.move(my_building.id, enemy_buildings[0].id, 1))
        })
      }

      /* Играем за рунного кузнеца */

      if (game_teams.my_her.hero_type === HeroType.BlackSmith) {
        // Проверяем доступность абилки Щит
        if (state.ability_ready(AbilityType.indexOf('Armor')))
          process.send(game_teams.my_her.armor(my_buildings[0].id));

        // Проверяем доступность абилки Разрушение
        if (enemy_squads.length > 4)
          if (state.ability_ready(AbilityType.indexOf('Area_damage'))) {
            location = game_map.get_squad_center_position(enemy_squads[2]);
            process.send(game_teams.my_her.area_damage(location))
          }

        // Upgrade башни
        if (my_buildings[0].level.id < game_params.tower_levels.length - 1) {
          // Если хватает стоимости на upgrade
          const update_coast = game_params.get_tower_level(my_buildings[0].level.id + 1).update_coast;
          if (update_coast < my_buildings[0].creeps_count) {
            process.send(game_teams.my_her.upgrade_tower(my_buildings[0].id));
            my_buildings[0].creeps_count -= update_coast;
          }
        }

        // Атакуем башню противника
        // определяем расстояние между башнями
        const distance = game_map.towers_distance(my_buildings[0].id, enemy_buildings[0].id);
        // определяем сколько тиков идти до нее со стандартной скоростью
        const ticks = distance / game_params.creep.speed;
        // определяем прирост башни в соответствии с ее уровнем
        let enemy_creeps = 0;
        if (enemy_buildings[0].creeps_count >= enemy_buildings[0].level.player_max_count)
          // если текущее количество крипов больше чем положено по уровню
          enemy_creeps = enemy_buildings[0].creeps_count;
        else {
          // если меньше - будет прирост
          const grow_creeps = ticks / enemy_buildings[0].level.creep_creation_time;
          enemy_creeps = enemy_buildings[0].creeps_count + grow_creeps;
          if (enemy_creeps >= enemy_buildings[0].level.player_max_count)
            enemy_creeps = enemy_buildings[0].level.player_max_count
        }
        // определяем количество крипов с учетом бонуса защиты
        const enemy_defence = enemy_creeps * (1 + enemy_buildings[0].DefenseBonus);
        // если получается в моей башне крипов больше + 10 на червя - идем на врага всей толпой
        if (enemy_defence + 10 < my_buildings[0].creeps_count)
          process.send(game_teams.my_her.move(my_buildings[0].id, enemy_buildings[0].id, 1))
      }

      /* Играем за воина */

      if (game_teams.my_her.hero_type === HeroType.Warrior) {
        // проверяем доступность абилки Крик
        if (state.ability_ready(AbilityType.indexOf('Growl')))
          process.send(game_teams.my_her.growl(enemy_buildings[0].id));

        // атака сразу используя абилку Берсерк
        if (my_buildings[0].creeps_count > 16)
          process.send(game_teams.my_her.move(my_buildings[0].id, enemy_buildings[0].id, 1));

        // проверяем доступность абилки Берсерк
        if (state.ability_ready(AbilityType.indexOf('Berserk'))) {
          // для эффективности повышаем площадь, применяем на 5 отрядах
          if (my_squads.length > 5) {
            // сколько тиков первому отряду осталось до башни
            const left_to_aim = my_squads[0].way.left / my_squads[0].speed;
            // Если первый отряд находится в зоне инициализации абилки
            const berserk_parameters = game_params.get_ability_parameters(AbilityType.indexOf(
              'Berserk'));
            if (berserk_parameters.cast_time + 50 > left_to_aim) {
              location = game_map.get_squad_center_position(my_squads[2]);
              process.send(game_teams.my_her.berserk(location))
            }
          }
        }
      }
      // Применение абилки ускорение
      if (my_squads.length > 4) {
        if (state.ability_ready(AbilityType.indexOf('Speed_up'))) {
          location = game_map.get_squad_center_position(my_squads[2]);
          process.send(game_teams.my_her.speed_up(location));
        }
      }
    }
  }
  catch (e) {
    process.send('end');
     console.log('error',e)
  } finally {
  }
};

  process.on('message', async (game) => {
    if(game.initial) {
     game_map = new Map(game.data);  // карта игрового мира
    game_params = new Parameters(game.data);  // параметры игры
     game_teams = new Teams(game.data);  // моя команда
    }
    else
    await Bot(game.data, game_teams, game_params,game_map);
  });
