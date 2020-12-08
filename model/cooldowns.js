import { AbilityType } from './abilites.js';
  class Cooldown {
  /* Фриз на применение абилок*/
  constructor(cooldown) {
    this.ability = AbilityType[cooldown.Ability];  // тип абилки
    this.player_color = cooldown.PlayerColor;  // кто применил
    this.ticks_to_cooldown_end = cooldown.TicksToCooldownEnd; // сколько тиков осталось до повторного применения
  }
}
