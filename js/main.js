import {UserInterface, Commands} from './console.js';

var commands = new Commands("../data/console.JSON");
var userInterface = new UserInterface(commands, 'input', 'output');
userInterface.initialize();

var cv = undefined;
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    cv = JSON.parse(this.responseText);
  }
};
xmlhttp.open("GET", "../data/cv.JSON", true);
xmlhttp.send();

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
          case 'msg':
            return commands.consoleResponses['msg']['help'];
            break;
          default:
            return commands.consoleResponses['help']['default'];
        }
      } else {
        return commands.consoleResponses['help']['response'];
      }
      break;
    case 'cv':
      function typingPause() {
        if (userInterface.typing == 0) {
          userInterface.clearScreen();
          userInterface.updateConsoleHistory(cv['title']);
        } else {
          setTimeout(typingPause, userInterface.typeSpeed);
        }
      }
      typingPause();
      break;
    case 'git':
      window.location.assign(commands.consoleResponses['git']['hyperlink']);
      break;
    case 'link':
      window.location.assign(commands.consoleResponses['link']['hyperlink']);
      break;
    case 'msg':
      return commands.consoleResponses['msg']['response'];
      break;
    default:
      return commands.consoleResponses['default'];
  }
}
