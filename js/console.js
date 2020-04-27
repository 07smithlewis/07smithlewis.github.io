class UserInterface {
  constructor(commandsObject) {
    this.commands = commandsObject
    this.consoleState = ''
    this.consoleHistory = ''
    this.typing = 0;
    this.cursorToggled = 0
    this.fontSize = 16
    this.newline = '</pre><br><pre>'
    this.typeSpeed = 10
    this.newlineDelay = 200
  }

   drawScreen() {
    var screenFormat = '<pre>' + this.consoleHistory + this.newline + '> ' + this.consoleState;
    if (this.cursorToggled === 1) {
      screenFormat += '_';
    }
    screenFormat += '</pre>'
    document.getElementById('text').innerHTML = screenFormat;
  }

  updateConsoleHistory(text) {
    function typingComplete(outputObject) {
      outputObject.typing = 0;
    }
    function checkIfTyping(outputObject) {
      if (outputObject.typing === 0) {
        outputObject.typing = 1;

        outputObject.consoleHistory += outputObject.newline;
        outputObject.drawScreen();
        var i = 0;
        function addChar(outputObject) {
          if (i < text.length) {
            if (text.charAt(i) == '<' && text.length - i >= 4 && text.slice(i, i+4) == '<br>') {
              i += 4;
              outputObject.consoleHistory += outputObject.newline;
            } else {
              outputObject.consoleHistory += text.charAt(i);
              i++;
            }
            outputObject.drawScreen();
            setTimeout(addChar, outputObject.typeSpeed, outputObject)
          } else {
            setTimeout(typingComplete, outputObject.newlineDelay, outputObject)
          }
        }
        addChar(outputObject)

      } else {
        setTimeout(checkIfTyping, outputObject.typeSpeed, outputObject);
      }
    }
    checkIfTyping(this);
  }

  initialize() {
    function toggleCursor(outputObject) {
      if (outputObject.cursorToggled === 0) {
        outputObject.cursorToggled = 1;
      } else {
        outputObject.cursorToggled = 0;
      }
      outputObject.drawScreen();
    }
    setInterval(toggleCursor, 500, this);

    document.addEventListener("keypress", event => {
      switch (event.keyCode) {
        case 13:
          this.updateConsoleHistory("'" + this.consoleState + "'");
          this.updateConsoleHistory(this.commands.read(this.consoleState));
          this.consoleState = '';
          break;
        default:
          this.consoleState += event.key;
      }
      this.drawScreen();
    });
    document.addEventListener("keydown", event => {
      switch (event.keyCode) {
        case 8:
          this.consoleState = this.consoleState.slice(0, -1);
          break;
      }
      this.drawScreen();
    });

    function consoleMessage(uiObject) {
      if (uiObject.commands.commandsData == undefined) {
        setTimeout(consoleMessage, 5, uiObject);
      } else {
        console.log(JSON.stringify(uiObject.commands.commandsData));
        uiObject.updateConsoleHistory(uiObject.commands.commandsData['welcome wagon']);
      }
    }
    consoleMessage(this);
  }

  getPageWidth() {
    var innerWidth = window.innerWidth;
    var charNumber = Math.round(innerWidth / this.fontSize);
    return charNumber;
  }
}

class Commands {
  constructor() {
    this.commandsData = undefined;
    var commandsDataDump = undefined;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        commandsDataDump = JSON.parse(this.responseText);
      }
    };
    xmlhttp.open("GET", "./data/console.txt", true);
    xmlhttp.send();

    function setCommandsData(commandsObject) {
      if (commandsDataDump == undefined) {
        setTimeout(setCommandsData, 5, commandsObject);
      } else {
        commandsObject.commandsData = commandsDataDump;
      }
    }
    setCommandsData(this);
  }

  read(command) {
    switch (command.toLowerCase()) {
      case 'help':
        return this.commandsData['responses']['help'];
        break;
      default:
        return this.commandsData['responses']['default'];
    }
  }
}

console.log('test log');
commands = new Commands;
var userInterface = new UserInterface(commands);
userInterface.initialize();
