const {gzip, ungzip} = require('node-gzip');
const { Base64 } = require('js-base64');


class ParentsMessage {
  json = {};
  send_message = async (json = this.json) => {
    json = JSON.stringify(json);
    json = Buffer.from(json,'utf8');
    const compressed = await gzip(json);
    let byte = compressed.toString('base64')
    return byte;
  }

  to_string = () => {
    return escape(JSON.stringify(this.json));
  }
}

class Message extends ParentsMessage {
  json = {};

  constructor(msg_base64) {
    super();
    let buff = new Buffer(msg_base64).toString('utf8');
    console.log(buff)
    ungzip(buff).then((decompressed) => {
        console.log(10,decompressed)
        this.json = JSON.parse(decompressed)
        this.msg_type = this.json["MsgType"];
        if (this.json.GameId)
          this.game_id = this.json["GameId"];
        else
          this.game_id = 0;
      })
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



// const buffer =
//  '<Buffer 48 34 73 49 41 47 6a 6c 30 46 38 41 2f 78 79 4d 4f 77 37 43 4d 42 41 46 37 37 4a 31 48 47 55 54 62 32 79 6e 67 77 61 6c 51 49 72 34 48 4d 44 59 61 79 70 49 73 45 32 42 6f 74 77 64 51 7a 4e 36 78 62 78 5a 34 5a 6a 75 6c 38 2f 43 4d 4b 43 71 34 4d 78 50 7a 78 47 47 46 63 59 46 42 70 42 39 33 5a 6d 61 5a 49 32 74 67 67 71 6d 4f 65 62 69 6b 55 62 63 4b 6a 6a 78 36 38 30 70 48 2b 79 44 4a 78 73 4c 4d 38 65 30 69 2f 66 30 75 31 38 54 78 39 47 58 68 4a 59 4e 65 68 4e 51 75 4a 35 59 53 49 32 74 73 4d 6f 33 42 61 45 4c 77 52 6f 79 46 6b 74 36 50 2b 65 2f 54 68 32 37 45 4a 51 58 68 47 69 45 35 42 73 4a 62 52 70 64 46 6a 6c 73 6e 65 71 34 4e 37 42 74 58 77 45 47 41 50 76 39 71 68 32 33 41 41 41 41 >';
// const buff = '<Buffer 78 9c 53 35 77 52 35 32 4a 03 62 55 63 47 10 2b 25 2d 3d 05 cc 35 77 01 00 5c b7 06 c3>';
// const ttt = JSON.stringify({'t':'fgrge'});

// const send_message = (json) => {
//   return new Promise(function (resolve, reject) {
//       deflate(escape(json), (err, buffer) => {
//         if (err)
//           reject(err);
//         else
//           resolve(buffer);
//       })
//     },
//   )
// }
// send_message(ttt).then(res=>console.log(typeof res))
 const test = 'H4sIAEod0V8A/wzLSwrCMBQF0L3ccRN8Ly/kswHpQBB0A4GbOmot1YmU7t2OD2fH7fN6/taOKnHAtc19JCrUVFIgXWOjs5Inl1XptBSGKBounDDg0Rf2DXXHuJ7Lohf1ybyInHp/b1/UmFOx4/gLIMAAcy2GqmoAAAA='
    const test1 = new Message(test)


// const test = new Message(buffer);