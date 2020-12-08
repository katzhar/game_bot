const { Base64 } = require('js-base64');
const {gzip, ungzip} = require('node-gzip');

class Message {
  json = {};

  constructor (msg_base64) {
    let msg_gzip = Base64.decode(msg_base64);
    let msg_bytes, msg_string;
    ungzip(msg_gzip).then( (res) => {
      msg_bytes = res;})
      .then(() => {
        msg_string = Base64.atob(msg_bytes);
        this.json = JSON.parse(msg_string)
        this.msg_type = this.json["MsgType"];
        if (this.json.GameId)
          this.game_id = this.json["GameId"];
        else
          this.game_id = 0;
      })
  }

  send_message = async () => {
    let msg_string = JSON.stringify(this.json);
    let msg_gzip = await gzip(Base64.btoa(msg_string));
    let msg_base64 = Base64.encode(msg_gzip.toString());
    return msg_base64;
  };

  to_string = () => {
    return escape(JSON.stringify(this.json));
  }
}

class RequestGame extends Message {
  json = {
    "MsgType": 17,
    "RequestGameParametersArgs": {
      "BotId": "",
    },
  };

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

class PlayerConnect extends Message {
  json = {
    "MsgType": 8,
    "GameId": "",
    "Subscribers": [],
    "PlayerConnectArgs": {
      "PlayerId": "",
    },
  };

  constructor(game_server, game_id, bot_id) {
    super(game_server, game_id, bot_id);
    this.json["Subscribers"] = [...this.json["Subscribers"], game_server];
    this.json["GameId"] = game_id;
    this.json["PlayerConnectArgs"]["PlayerId"] = bot_id;
  }
}

class PlayerChangeHero extends Message {
  json = {
    "MsgType": 22,
    "GameId": "",
    "Subscribers": [],
    "PlayerChangeHeroTypeArgs": {
      "PlayerId": "",
      "HeroType": 0,
    },
  };

  constructor(game_server, game_id, bot_id, hero_type) {
    super(game_server, game_id, bot_id, hero_type);
    this.json["Subscribers"] = [...this.json["Subscribers"], game_server];
    this.json["GameId"] = game_id;
    this.json["PlayerChangeHeroTypeArgs"]["PlayerId"] = bot_id;
    this.json["PlayerChangeHeroTypeArgs"]["HeroType"] = hero_type;
  }
}

class PlayerChangeColor extends Message {
  json = {
    "MsgType": 23,
    "GameId": "",
    "Subscribers": [],
    "PlayerChangeColorArgs": {
      "PlayerId": "",
      "PlayerColor": 2,
    },
  };

  constructor(game_server, game_id, bot_id, player_color) {
    super(game_server, game_id, bot_id, player_color);
    this.json["Subscribers"] = { ...this.json["Subscribers"], game_server };
    this.json["GameId"] = game_id;
    this.json["PlayerChangeColorArgs"]["PlayerId"] = bot_id;
    this.json["PlayerChangeColorArgs"]["PlayerColor"] = player_color;
  }
}

class PlayerPrepared extends Message {
  json = {
    "MsgType": 11,
    "GameId": "",
    "Subscribers": [],
    "PlayerPreparedArgs": {
      "PlayerId": "",
    },
  };

  constructor(game_server, game_id, bot_id) {
    super(game_server, game_id, bot_id);
    this.json["Subscribers"] = { ...this.json["Subscribers"], game_server };
    this.json["GameId"] = game_id;
    this.json["PlayerPreparedArgs"]["PlayerId"] = bot_id;
  }
}

class PlayerReady extends Message {
  json = {
    "MsgType": 13,
    "GameId": "",
    "Subscribers": [],
    "PlayerReadyArgs": {
      "PlayerId": "",
    },
  };

  constructor(game_server, game_id, bot_id) {
    super(game_server, game_id, bot_id);
    this.json["Subscribers"] = { ...this.json["Subscribers"], game_server };
    this.json["GameId"] = game_id;
    this.json["PlayerReadyArgs"]["PlayerId"] = bot_id;
  }
}

class GameActions extends Message {
  json = {
    "MsgType": 3,
    "GameId": "",
    "Subscribers": [],
    "GameActionsArgs": {
      "Action": {},
    },
  };

  constructor(game_server, game_id, action) {
    super(game_server, game_id, action);
    this.json["Subscribers"] = { ...this.json["Subscribers"], game_server };
    this.json["GameId"] = game_id;
    this.json["GameActionsArgs"]["Action"] = action;
  }
}

module.exports.Message = Message;
module.exports.PlayerChangeHero = PlayerChangeHero;
module.exports.PlayerChangeColor = PlayerChangeColor;
module.exports.GameActions = GameActions;
module.exports.PlayerPrepared = PlayerPrepared;
module.exports.PlayerReady = PlayerReady;
module.exports.RequestGame = RequestGame;
module.exports.PlayerConnect = PlayerConnect;

