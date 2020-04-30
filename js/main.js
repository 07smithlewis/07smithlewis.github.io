import {UserInterface, Commands} from './console.js';
import {CvRead} from './cv.js';

var commands = new Commands("../data/console.JSON");
var userInterface = new UserInterface(commands, 'input2', 'output', 'main');
userInterface.initialize();

commands.read = function read(command, userInterfaceObject) {

  var commandSplit = command.toLowerCase().split(/[ ]+/);
  switch (commands.consoleResponses['dictionary'][commandSplit[0]]) {
    case 'help':
      if (commandSplit.length > 1) {
        switch (commands.consoleResponses['dictionary'][commandSplit[1]]) {
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
      userInterface.commands = new CvRead(commands, userInterface);
      return commands.consoleResponses['cv']['response'];
      break;
    case 'git':
      window.open(commands.consoleResponses['git']['hyperlink']);
      return commands.consoleResponses['git']['response'];
      break;
    case 'link':
      window.open(commands.consoleResponses['link']['hyperlink']);
      return commands.consoleResponses['link']['response'];
      break;
    default:
      return commands.consoleResponses['default'];
  }
}
