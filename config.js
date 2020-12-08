const { ArgumentParser } = require('argparse');
const Game = require('./model/game');

if (typeof require !== 'undefined' && require.main === module) {
    const parser = new ArgumentParser({
        description: 'Runner for ITGod'
    });

    parser.add_argument('-i', '--ip', {
        type: 'str',
        nargs: '?',
        help: 'Server IP',
        default: process.env.SERVER_IP
    });

    parser.add_argument('-b', '--bot', {
        type: 'str',
        nargs: '?',
        help: 'Bot Id',
        default: process.env.BOT_ID
    });

    parser.add_argument('-u', '--user', {
        type: 'str',
        nargs: '?',
        help: 'User Id',
        default: process.env.USER_ID
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
    // const process = Popen(["python", "-u", "index.py"], stdout = PIPE, stdin = PIPE)

    if (args.srv) {
        new Game(process, `${args.ip}/game`, null, args.bot, args.game)
    } else {
        new Game(process, `${args.ip}/game`, args.user, args.bot, null)
    }
}
