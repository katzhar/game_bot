const WebSocket = require('ws');
export class Game {
    bot_ready = true;

    constructor(process, websocket_url, user_id, bot_id, game_id) {
        this.process = process;
        if (!game_id) {
            this.game_id = 0;
        } else {
            this.game_id = game_id;
        }
        this.user_id = user_id;
        this.bot_id = bot_id;
        this.lobby_changed = 0;
        this.ssl_context = ssl.SSLContext();
        this.ssl_context.check_hostname = false;
        this.ssl_context.verify_mode = ssl.CERT_NONE;
        this.loop = asyncio.get_event_loop();
        this.loop.run_until_complete(
        this.run(websocket_url, user_id, bot_id, game_id); 
    }

    run = async (websocket_url, user_id, bot_id, game_id) => {
        const ws = new WebSocket(websocket_url);
        ws.on('connect failed', (err) => {
            console.log('Connect Error: ' + err.toString());
        })
        ws.on('connect', (connection) => {
            console.log("OUT >>> Request Game");
            connection.on('error', (error) => {
                console.log("Connection Error: " + error.toString());
            });
            connection.on('message', (message) => {
                    console.log(message);
            });
        });
        // let msg = RequestGame(user_id, bot_id, game_id);
        // await ws.send(msg.send_message());
        // await this.handler(ws);
    }

    handler = async (ws) => {
        for (let message in ws) {
            const input_msg = Message(message);

            if (input_msg.game_id === 0) {
                input_msg.msg_type = 0;
            }

            if (this.game_id !== 0 && this.game_id !== input_msg.game_id) {
                input_msg.msg_type = 0;
            }

            if (input_msg.msg_type === 18) {
                console.log("IN <<< Game parameters");

                this.game_id = input_msg.game_id;
                this.game_server = input_msg.json["ResponseGameParametersArgs"]["GameServer"];
                this.game_parameters = input_msg;
                let player_color = null;
                
                // Выбор цвета игрока
                let team_players = this.game_parameters.json["ResponseGameParametersArgs"]["TeamPlayers"];

                const botConnect = () => {
                    let output_msg = PlayerConnect(this.game_server, this.game_id, this.bot_id);
                    console.log("OUT >>> Bot connect");
                    await ws.send(output_msg.send_message());
                }
                setTimeout(botConnect(), 100);

                // Определение героя бота
                const botChooseHero = () => {
                    hero_type = this.game_parameters.json["ResponseGameParametersArgs"]["HeroType"];
                    output_msg = PlayerChangeHero(this.game_server, this.game_id, this.bot_id, hero_type);
                    console.log("OUT >>> Bot choose hero");
                    await ws.send(output_msg.send_message());
                }
                setTimeout(botChooseHero(), 100);

                for (team in team_players) {
                    if (team.includes("PlayerId") && team["PlayerId"] === this.bot_id) {
                        player_color = team["PlayerColor"];
                    }
                }

                if (!player_color) {
                    for (team in team_players) {
                        if (!team.includes("PlayerId")) {
                            player_color = team["PlayerColor"]
                        }
                    }
                }

                const botPlayerChangeColor = () => {
                    let output_msg = PlayerChangeColor(this.game_server, this.game_id, this.bot_id, player_color);
                    console.log("OUT >>> Bot choose color");
                    await ws.send(output_msg.send_message());
                }
                setTimeout(botPlayerChangeColor(), 100);

                // Передача боту параметров игры
                this.game_parameters.json["HeroType"] = hero_type;
                this.game_parameters.json["PlayerColor"] = player_color;
            }

            if (input_msg.msg_type === 24) {
                console.log("IN <<< Lobby changed");
                this.lobby_changed += 1;
                if (this.lobby_changed > 2) {
                    console.log(">>> GAME READY <<<");
                }
            }

            if (input_msg.msg_type === 10) {
                console.log("IN <<< All players connected");

                let output_msg = PlayerPrepared(this.game_server, this.game_id, this.bot_id);
                console.log("OUT >>> Bot prepared");
                await ws.send(output_msg.send_message());

                // Передача боту параметров игры
                this.game_parameters.json["Teams"] = input_msg.json["AllPlayersConnectedArgs"]["Teams"];
                let msg_bytes = this.game_parameters.toString().encode() + '/n';
                this.process.stdin.write(msg_bytes)
                this.process.stdin.flush();
            }

            if (input_msg.msg_type == 12) {
                console.log("IN <<< All players prepared")
                let output_msg = PlayerReady(this.game_server, this.game_id, this.bot_id)
                console.log("OUT >>> Bot ready")
                await ws.send(output_msg.send_message())
            }

            if (input_msg.msg_type === 14) {
                console.log("IN <<< All players ready");
            }

            if (input_msg.msg_type === 2) {
                console.log("IN <<< Game started");
            }

            if (input_msg.msg_type === 4) {
                if (this.bot_ready) {
                    console.log("IN <<< Game tick: " + str(input_msg.json["GameStateArgs"]["Tick"]));

                    // Если бот готов, отправляем ему стейт
                    this.bot_ready = false;

                    let msg_bytes = '{}\n'.format(json.dumps(input_msg.json["GameStateArgs"], ensure_ascii = False)).encode()
                    this.process.stdin.write(msg_bytes)
                    this.process.stdin.flush()

                    // Запускаем асинхронное ожидание команды
                    this.loop.create_task(this.get_command(ws))
                }
            }

            if (input_msg.msg_type === 6) {
                console.log("IN <<< Game over");
                this.process.kill();
                await ws.close();
            }

            if (input_msg.msg_type === 5) {
                console.log("IN <<< Game cancel");
                this.process.kill();
                await ws.close();
            }

            if (input_msg.msg_type === 9) {
                console.log("IN <<< Player disconnected");
            }
        }
    }

    get_command = async (ws) => {
        while (!this.bot_ready) {
            //command = this.process.stdout.readline().decode('utf-8').strip();
            if (command === "end") {
                this.bot_ready = true;
            }
            else if (command) {
                console.log("OUT >>> Send command: " + command);
                let msg = GameActions(this.game_server, this.game_id, json.Parse(command));
                await ws.send(msg.send_message());
            }
        }
    }
}