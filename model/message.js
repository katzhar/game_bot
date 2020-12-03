const { Base64 } = require('js-base64');
const { gzip, ungzip } = require('node-gzip');

export class Message {
  json = {};

  constructor(msg_base64) {
    let msg_gzip = Base64.decode(msg_base64);
    let msg_bytes = ungzip(msg_gzip);
    let msg_string = msg_bytes.decode();
    this.json = json.parse(msg_string);
    this.msg_type = this.json["MsgType"];
    if (this.json.GameId)
      this.game_id = this.json["GameId"];
    else
      this.game_id = 0;
  }

  send_message = () => {
    let msg_string = json.stringify(this.json);
    let msg_gzip = gzip(msg_string.encode());
    let msg_base64 = Base64.encode(msg_gzip);
    return msg_base64;
  }
  to_string = () => {
    return escape(json.stringify(this.json));
  }
}

export class RequestGame extends Message {
  json = {
    "MsgType": 17,
    "RequestGameParametersArgs": {
      "BotId": "",
    },
  }

  constructor(user_id, bot_id, game_id) {
    super(user_id, bot_id, game_id);
    if (user_id)
      this.json["RequestGameParametersArgs"]["UserId"] = user_id;
    if (bot_id)
      this.json["RequestGameParametersArgs"]["BotId"] = bot_id;
    if (game_id)
      this.json["RequestGameParametersArgs"]["GameId"] = game_id;
  }
}

export class PlayerConnect extends Message {
  json = {
    "MsgType": 8,
    "GameId": "",
    "Subscribers": [],
    "PlayerConnectArgs": {
      "PlayerId": "",
    },
  }

  constructor(game_server, game_id, bot_id) {
    super(game_server, game_id, bot_id);
    this.json["Subscribers"] = [...this.json["Subscribers"], game_server]
    this.json["GameId"] = game_id;
    this.json["PlayerConnectArgs"]["PlayerId"] = bot_id;
  }
}

export class PlayerChangeHero extends Message {
  json = {
    "MsgType": 22,
    "GameId": "",
    "Subscribers": [],
    "PlayerChangeHeroTypeArgs": {
      "PlayerId": "",
      "HeroType": 0,
    },
  }

  constructor(game_server, game_id, bot_id, hero_type) {
    super(game_server, game_id, bot_id, hero_type);
    this.json["Subscribers"] = [...this.json["Subscribers"], game_server]
    this.json["GameId"] = game_id;
    this.json["PlayerChangeHeroTypeArgs"]["PlayerId"] = bot_id;
    this.json["PlayerChangeHeroTypeArgs"]["HeroType"] = hero_type;
  }
}

export class PlayerChangeColor extends Message {
  json = {
    "MsgType": 23,
    "GameId": "",
    "Subscribers": [],
    "PlayerChangeColorArgs": {
      "PlayerId": "",
      "PlayerColor": 2,
    },
  }

  constructor(game_server, game_id, bot_id, player_color) {
    super(game_server, game_id, bot_id, player_color);
    this.json["Subscribers"] = { ...this.json["Subscribers"], game_server };
    this.json["GameId"] = game_id
    this.json["PlayerChangeColorArgs"]["PlayerId"] = bot_id;
    this.json["PlayerChangeColorArgs"]["PlayerColor"] = player_color;
  }
}

export class PlayerPrepared extends Message {
  json = {
    "MsgType": 11,
    "GameId": "",
    "Subscribers": [],
    "PlayerPreparedArgs": {
      "PlayerId": "",
    },
  }

  constructor(game_server, game_id, bot_id) {
    super(game_server, game_id, bot_id);
    this.json["Subscribers"] = { ...this.json["Subscribers"], game_server };
    this.json["GameId"] = game_id;
    this.json["PlayerPreparedArgs"]["PlayerId"] = bot_id;
  }
}

export class PlayerReady extends Message {
  json = {
    "MsgType": 13,
    "GameId": "",
    "Subscribers": [],
    "PlayerReadyArgs": {
      "PlayerId": "",
    },
  }

  constructor(game_server, game_id, bot_id) {
    super(game_server, game_id, bot_id);
    this.json["Subscribers"] = { ...this.json["Subscribers"], game_server };
    this.json["GameId"] = game_id
    this.json["PlayerReadyArgs"]["PlayerId"] = bot_id;
  }
}

export class GameActions extends Message {
  json = {
    "MsgType": 3,
    "GameId": "",
    "Subscribers": [],
    "GameActionsArgs": {
      "Action": {},
    },
  }

  constructor(game_server, game_id, action) {
    super(game_server, game_id, action)
    this.json["Subscribers"] = { ...this.json["Subscribers"], game_server };
    this.json["GameId"] = game_id
    this.json["GameActionsArgs"]["Action"] = action;
  }
}
