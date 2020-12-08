import { Game } from './model/game.js';
const { ArgumentParser } = require('argparse');
const server_ip = 'wss://gameapi.it-god.ru';
const user_id = '3616b393-c3e3-4899-9eb8-84d15f18e0cb';
const bot_id = '08def1f1-5e6f-4cab-9850-5868c500b835';

if (typeof require !== 'undefined' && require.main === module) {
    const parser = new ArgumentParser({
        description: 'Runner for ITGod'
    });

    parser.add_argument('-i', '--ip', {
        type: 'str',
        nargs: '?',
        help: 'Server IP',
        default: server_ip
    });

    parser.add_argument('-b', '--bot', {
        type: 'str',
        nargs: '?',
        help: 'Bot Id',
        default: bot_id
    });

    parser.add_argument('-u', '--user', {
        type: 'str',
        nargs: '?',
        help: 'User Id',
        default: user_id
    });

    parser.add_argument('-g', '--game', {
        type: 'str',
        nargs: '?',
        help: 'Game Id'
    });

    parser.add_argument('-s', '--srv', {
        action: 'store_true',
        help: 'Service argument'
    });

    const args = parser.parse_args();

    if (args.srv) {
        new Game(process, `${args.ip}/game`, null, args.bot, args.game)
    } else {
        new Game(process, `${args.ip}/game`, args.user, args.bot, null)
    }
}
