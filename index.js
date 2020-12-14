const Game = require('./model/game');
const { ArgumentParser } = require('argparse');
IP = 'wss://ift.gameapi.it-god.ru';
USERID = '7568130b-216f-46f6-b9f5-e9f33be1f80d';
BOTID = 'dfdce4b2-9744-406b-87e0-f92eb13339e5';

if (typeof require !== 'undefined' && require.main === module) {
    const parser = new ArgumentParser({
        description: 'Runner for ITGod'
    });

    parser.add_argument('-i', '--ip', {
        type: 'str',
        nargs: '?',
        help: 'Server IP',
        default: IP
    });

    parser.add_argument('-b', '--bot', {
        type: 'str',
        nargs: '?',
        help: 'Bot Id',
        default: BOTID
    });

    parser.add_argument('-u', '--user', {
        type: 'str',
        nargs: '?',
        help: 'User Id',
        default: USERID
    });

    parser.add_argument('-g', '--game', {
        type: 'str',
        nargs: '?',
        help: 'Game Id'
    });

    parser.add_argument('-s', '--system', {
        action: 'store_true',
        help: 'Service argument'
    });

    const args = parser.parse_args();

    if (args.system) {
        new Game(`${args.ip}/game`, null, args.bot, args.game);
    } else {
        new Game(`${args.ip}/game`, args.user, args.bot, null);
    }
}
