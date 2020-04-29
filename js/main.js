import {UserInterface, Commands} from './console.js';
import {CvRead} from './cv.js';

var commands = new Commands("../data/console.JSON");
var userInterface = new UserInterface(commands, 'input', 'output', 'main');
userInterface.initialize();

commands.read = function read(command) {

  var commandSplit = command.toLowerCase().split(/[ ]+/);
  switch (commandSplit[0]) {
    case 'help':
      if (commandSplit.length > 1) {
        switch (commandSplit[1]) {
          case 'help':
            return commands.consoleResponses['help']['help'];
            break;
          case 'cv':
            return commands.consoleResponses['cv']['help'];
            break;
          case 'git':
            return commands.consoleResponses['git']['help'];
            break;
          case 'link':
            return commands.consoleResponses['link']['help'];
            break;
          default:
            return commands.consoleResponses['help']['default'];
        }
      } else {
        return commands.consoleResponses['help']['response'];
      }
      break;
    case 'cv':
      var cvRead = new CvRead(commands, userInterface);
      cvRead.overrideRead();
      return commands.consoleResponses['cv']['response'];
      break;
    case 'git':
      window.location.assign(commands.consoleResponses['git']['hyperlink']);
      return commands.consoleResponses['git']['response'];
      break;
    case 'link':
      window.location.assign(commands.consoleResponses['link']['hyperlink']);
      return commands.consoleResponses['link']['response'];
      break;
    default:
      return commands.consoleResponses['default'];
  }
}
