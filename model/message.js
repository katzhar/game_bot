const { deflate, unzip } = require('zlib');


class ParentsMessage {
  json = {};
  send_message = (json = this.json) => {
    return new Promise(function (resolve, reject) {
        deflate(escape(json), (err, buffer) => {
          if (err)
            reject(err);
          else
            resolve(buffer.toString('base64'));
        })
      },
    )
  }

  to_string = () => {
    return escape(JSON.stringify(this.json));
  }

}

class Message extends ParentsMessage {
  json = {};

  constructor(msg_base64) {
    super();
    console.log(2, msg_base64);
    // const buffer = Buffer.from(msg_base64, 'base64');
    unzip(msg_base64, (err, msg_base64) => {
      if (err) {
        console.error('An error occurred:', err);
        process.exitCode = 1;
      }
      let msg_string = msg_base64.toString();
      this.json = JSON.parse(unescape(msg_string))
      this.msg_type = this.json["MsgType"];
      if (this.json.GameId)
        this.game_id = this.json["GameId"];
      else
        this.game_id = 0;
    });
  }
}

class RequestGame extends ParentsMessage {
  json = {
    "MsgType": 17,
    "RequestGameParametersArgs": {
      "BotId": "",
    },
  };

  constructor(user_id, bot_id, game_id) {
    super();
    if (user_id)
      this.json["RequestGameParametersArgs"]["UserId"] = user_id;
    if (bot_id)
      this.json["RequestGameParametersArgs"]["BotId"] = bot_id;
    if (game_id)
      this.json["RequestGameParametersArgs"]["GameId"] = game_id;
  }
}

class PlayerConnect extends ParentsMessage {
  json = {
    "MsgType": 8,
    "GameId": "",
    "Subscribers": [],
    "PlayerConnectArgs": {
      "PlayerId": "",
    },
  };

  constructor(game_server, game_id, bot_id) {
    super();
    this.json["Subscribers"] = [...this.json["Subscribers"], game_server];
    this.json["GameId"] = game_id;
    this.json["PlayerConnectArgs"]["PlayerId"] = bot_id;
  }
}

class PlayerChangeHero extends ParentsMessage {
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
    super();
    this.json["Subscribers"] = [...this.json["Subscribers"], game_server];
    this.json["GameId"] = game_id;
    this.json["PlayerChangeHeroTypeArgs"]["PlayerId"] = bot_id;
    this.json["PlayerChangeHeroTypeArgs"]["HeroType"] = hero_type;
  }
}

class PlayerChangeColor extends ParentsMessage {
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
    super();
    this.json["Subscribers"] = { ...this.json["Subscribers"], game_server };
    this.json["GameId"] = game_id;
    this.json["PlayerChangeColorArgs"]["PlayerId"] = bot_id;
    this.json["PlayerChangeColorArgs"]["PlayerColor"] = player_color;
  }
}

class PlayerPrepared extends ParentsMessage {
  json = {
    "MsgType": 11,
    "GameId": "",
    "Subscribers": [],
    "PlayerPreparedArgs": {
      "PlayerId": "",
    },
  };

  constructor(game_server, game_id, bot_id) {
    super();
    this.json["Subscribers"] = { ...this.json["Subscribers"], game_server };
    this.json["GameId"] = game_id;
    this.json["PlayerPreparedArgs"]["PlayerId"] = bot_id;
  }
}

class PlayerReady extends ParentsMessage {
  json = {
    "MsgType": 13,
    "GameId": "",
    "Subscribers": [],
    "PlayerReadyArgs": {
      "PlayerId": "",
    },
  };

  constructor(game_server, game_id, bot_id) {
    super();
    this.json["Subscribers"] = { ...this.json["Subscribers"], game_server };
    this.json["GameId"] = game_id;
    this.json["PlayerReadyArgs"]["PlayerId"] = bot_id;
  }
}

class GameActions extends ParentsMessage {
  json = {
    "MsgType": 3,
    "GameId": "",
    "Subscribers": [],
    "GameActionsArgs": {
      "Action": {},
    },
  };

  constructor(game_server, game_id, action) {
    super();
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


// const send_message = (s) => {
//   return new Promise(function(resolve, reject){
//     deflate(escape(s),(err, buffer) =>{
//         if (err)
//           reject(err);
//         else
//           resolve(buffer.toString('base64'));
//       })
//   }
// )
// }
