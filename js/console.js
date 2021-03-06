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
    this.consoleHistory = '';
    this.consoleHistoryDisplayed = '';
    this.typing = 0;
    this.typingQue = [0, 0];
    this.cursorToggled = 0;
    this.fontSize = 16;
    this.charWidthMultiplier = 9/16;
    this.typeSpeed = 2;
    this.newlineDelay = 300;
  }

  scrollToBottom() {
    var div = document.getElementById(this.divId);
    div.scrollTop = div.scrollHeight - div.clientHeight;
  }

  drawScreen() {
    if (this.consoleHistory !== this.consoleHistoryDisplayed) {
      var screenFormatOutput = '<pre>' + this.consoleHistory + '</pre>';
      document.getElementById(this.htmlElementIdOutput).innerHTML = screenFormatOutput;
    }

    if (this.consoleHistory !== this.consoleHistoryDisplayed) {
      this.scrollToBottom();
    }
    this.consoleHistoryDisplayed = this.consoleHistory;
  }

  clearScreen(updateScreen) {
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
        outputObject.consoleHistory = '';
        if (updateScreen !== false) {
          outputObject.drawScreen();
        }
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
      console.log(window.innerWidth);
    }
    setInterval(toggleCursor, 500, this);

    document.addEventListener("keypress", event => {
      switch (event.keyCode) {
        case 13:
          var command = document.getElementById(this.htmlElementIdInput).innerText.replace(/[\n\r]+/g, '');
          setTimeout(() => {document.getElementById(this.htmlElementIdInput).innerText = ''}, 1);
          this.updateConsoleHistory("'" + command + "'");
          var text = this.commands.read(command, this);
          if (text != '') {
            this.updateConsoleHistory(text);
          }
          break;
        default:
          break;
      }
      this.drawScreen();
    });

    document.getElementById('main').focus();

    function consoleMessage(uiObject) {
      if (uiObject.commands.consoleStart == undefined) {
        setTimeout(consoleMessage, 5, uiObject);
      } else {
        uiObject.updateConsoleHistory(uiObject.commands.consoleStart);
      }
    }
    consoleMessage(this);
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
    switch (this.consoleResponses['dictionary'][commandSplit[0]]) {
      default:
        return this.consoleResponses['default'];
    }
  }
}
