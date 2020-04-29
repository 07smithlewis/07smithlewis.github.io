export class UserInterface {
  constructor(commandsObject, htmlElementIdInput, htmlElementIdOutput, divId) {
    this.commands = commandsObject;
    this.divId = divId;
    this.htmlElementIdInput = htmlElementIdInput;
    this.htmlElementIdOutput = htmlElementIdOutput;
    this.consoleState = '';
    this.consoleHistory = '';
    this.consoleStateDisplayed = '';
    this.consoleHistoryDisplayed = '';
    this.typing = 0;
    this.cursorToggled = 0;
    this.fontSize = 14;
    this.typeSpeed = 5;
    this.newlineDelay = 300;
  }

  scrollToBottom() {
    var div = document.getElementById(this.divId);
    div.scrollTop = div.scrollHeight - div.clientHeight;
  }

  drawScreen() {
    var screenFormatInput = '<pre>> ' + this.consoleState;
    if (this.cursorToggled === 1) {
      screenFormatInput += '_';
    }
    screenFormatInput += '</pre>';
    document.getElementById(this.htmlElementIdInput).innerHTML = screenFormatInput;

    if (this.consoleHistory !== this.consoleHistoryDisplayed) {
      var screenFormatOutput = '<pre>' + this.consoleHistory + '</pre>';
      document.getElementById(this.htmlElementIdOutput).innerHTML = screenFormatOutput;
    }
    document.getElementById('main').scrollTop = 0;

    if (this.consoleHistory !== this.consoleHistoryDisplayed || this.consoleStateDisplayed !== this.consoleState) {
        this.scrollToBottom();
    }
    this.consoleHistoryDisplayed = this.consoleHistory;
    this.consoleStateDisplayed = this.consoleState;
  }

  clearScreen() {
    this.consoleHistory = '';
    this.drawScreen();
  }

  updateConsoleHistory(text) {
    function typingComplete(outputObject) {
      outputObject.typing = 0;
    }
    function checkIfTyping(outputObject) {
      if (outputObject.typing === 0) {
        outputObject.typing = 1;

        outputObject.consoleHistory += '\n\n';
        outputObject.drawScreen();
        var i = 0;
        function addChar(outputObject) {
          if (i < text.length) {
            outputObject.consoleHistory += text.charAt(i);
            i++;
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
      if (uiObject.commands.consoleStart == undefined) {
        setTimeout(consoleMessage, 5, uiObject);
      } else {
        uiObject.updateConsoleHistory(uiObject.commands.consoleStart);
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

export class Commands {
  constructor(consoleJSON) {
    this.consoleStart = undefined;
    this.consoleResponses = undefined;
    var commandsDataDump = undefined;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        commandsDataDump = JSON.parse(this.responseText);
      }
    };
    xmlhttp.open("GET", consoleJSON, true);
    xmlhttp.send();

    function setCommandsData(commandsObject) {
      if (commandsDataDump == undefined) {
        setTimeout(setCommandsData, 5, commandsObject);
      } else {
        commandsObject.consoleStart = commandsDataDump['welcome wagon'];
        commandsObject.consoleResponses = commandsDataDump['commands']
      }
    }
    setCommandsData(this);
  }

  read(command) {
    switch (command.toLowerCase().split(" ")[0]) {
      default:
        return this.consoleResponses['default'];
    }
  }
}
