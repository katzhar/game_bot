const { ArgumentParser } = require('argparse');
const server_ip = 'wss://gameapi.it-god.ru';
const user_id = 'USER_ID';
const bot_id = 'BOT_ID';

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

    const process = Popen(["python", "-u", "index.py"], stdout = PIPE, stdin = PIPE)

    if (args.srv) {
        Game(process, "{}/game".format(args.ip), null, args.bot, args.game)
    } else {
        Game(process, "{}/game".format(args.ip), args.user, args.bot, null)
    }
}
