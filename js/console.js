function jsonLoader(file, callback) {
  var json = undefined;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      json = JSON.parse(this.responseText);
    }
  };
  xmlhttp.open("GET", file, true);
  xmlhttp.send();

  function returnJson() {
    if (json == undefined) {
      setTimeout(returnJson, 5);
    } else {
      callback(json);
    }
  }
  returnJson();
}

export class UserInterface {
  constructor(commandsObject, htmlElementIdInput, htmlElementIdOutput, divId) {
    this.commands = commandsObject;
    this.commandsDefault = commandsObject;
    this.divId = divId;
    this.htmlElementIdInput = htmlElementIdInput;
    this.htmlElementIdOutput = htmlElementIdOutput;
    this.consoleState = '';
    this.consoleHistory = '';
    this.consoleStateDisplayed = '';
    this.consoleHistoryDisplayed = '';
    this.typing = 0;
    this.typingQue = [0, 0];
    this.cursorToggled = 0;
    this.fontSize = 14;
    this.typeSpeed = 3;
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

    if (this.consoleHistory !== this.consoleHistoryDisplayed || this.consoleStateDisplayed !== this.consoleState) {
      this.scrollToBottom();
    }
    this.consoleHistoryDisplayed = this.consoleHistory;
    this.consoleStateDisplayed = this.consoleState;
  }

  clearScreen() {
    var typingQueNumber = this.typingQue[0] + 1;
    this.typingQue[0] += 1;

    function typingComplete(outputObject) {
      outputObject.typing = 0;
      outputObject.typingQue[1] += 1;
      if (outputObject.typingQue[0] == outputObject.typingQue[1]) {
        outputObject.typingQue = [0, 0];
      }
    }
    function checkQue(outputObject) {
      if (outputObject.typing == 0 && outputObject.typingQue[1]+1 == typingQueNumber) {
        outputObject.typing = 1;
        outputObject.consoleHistory = '';
        outputObject.drawScreen();
        setTimeout(typingComplete, outputObject.newlineDelay, outputObject)
      } else {
        setTimeout(checkQue, outputObject.typeSpeed, outputObject);
      }
    }
    checkQue(this);
  }

  updateConsoleHistory(text) {
    var typingQueNumber = this.typingQue[0] + 1;
    this.typingQue[0] += 1;
    console.log(this.typingQue);

    function typingComplete(outputObject) {
      outputObject.typing = 0;
      outputObject.typingQue[1] += 1;
      console.log(outputObject.typingQue);
      if (outputObject.typingQue[0] == outputObject.typingQue[1]) {
        outputObject.typingQue = [0, 0];
        console.log(outputObject.typingQue);
      }
    }
    function checkQue(outputObject) {
      if (outputObject.typing == 0 && outputObject.typingQue[1]+1 == typingQueNumber) {
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
        setTimeout(checkQue, outputObject.typeSpeed, outputObject);
      }
    }
    checkQue(this);
  }

  updateConsoleHistoryInstant(text) {
    var typingQueNumber = this.typingQue[0] + 1;
    this.typingQue[0] += 1;

    function typingComplete(outputObject) {
      outputObject.typing = 0;
      outputObject.typingQue[1] += 1;
      if (outputObject.typingQue[0] == outputObject.typingQue[1]) {
        outputObject.typingQue = [0, 0];
      }
    }
    function checkQue(outputObject) {
      if (outputObject.typing == 0 && outputObject.typingQue[1]+1 == typingQueNumber) {
        outputObject.typing = 1;
        outputObject.consoleHistory += text;
        outputObject.drawScreen();
        setTimeout(typingComplete, outputObject.newlineDelay, outputObject)
      } else {
        setTimeout(checkQue, outputObject.typeSpeed, outputObject);
      }
    }
    checkQue(this);
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
          this.updateConsoleHistory(this.commands.read(this.consoleState, this));
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
    var json = undefined;
    function jsonLoaded(jsonDump) {
      json = jsonDump;
    }
    jsonLoader(consoleJSON, jsonLoaded);

    function dataReady(commandsObject) {
      commandsObject.consoleStart = json['welcome wagon'];
      commandsObject.consoleResponses = json['commands'];
    }
    function extractProperties(callback, commandsObject) {
      if (json == undefined) {
        setTimeout(extractProperties, 5, callback, commandsObject);
      } else {
        callback(commandsObject);
      }
    }
    extractProperties(dataReady, this);
  }

  read(command, userInterfaceObject) {
    var commandSplit = command.toLowerCase().split(/[ ]+/);
    switch (commandSplit[0]) {
      default:
        return this.consoleResponses['default'];
    }
  }
}
