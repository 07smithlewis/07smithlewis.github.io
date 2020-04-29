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

export class CvRead {
  constructor(commands, userInterface) {
    this.userInterface = userInterface;
    this.commands = commands;
    this.readOld = commands.read;

    var json = undefined;
    function jsonLoaded(jsonDump) {
      json = jsonDump;
    }
    jsonLoader('../data/cv.JSON', jsonLoaded);

    function dataReady(cvReadObject) {
      cvReadObject.cv = json;
    }
    function saveToObject(callback, cvReadObject) {
      if (json == undefined) {
        setTimeout(saveToObject, 5, callback, cvReadObject);
      } else {
        callback(cvReadObject);
      }
    }
    saveToObject(dataReady, this);

    function typingPause(cvReadObject) {
      if (userInterface.typing == 0 && cvReadObject.cv !== undefined) {
        userInterface.clearScreen();
        userInterface.updateConsoleHistory(cvReadObject.cv['title']);
        var i;
        for (i = 0; i < cvReadObject.cv['headings'].length; i++) {
          userInterface.updateConsoleHistory(
            cvReadObject.cv['headings'][i] + "\n\n" + cvReadObject.cv['content'][i]
          );
        }
      } else {
        setTimeout(typingPause, userInterface.typeSpeed, cvReadObject);
      }
    }
    typingPause(this);
  }

  read(command, userInterfaceObject) {
    var cv = this.cv;

    function subsection(number) {
      userInterfaceObject.clearScreen();
      userInterfaceObject.updateConsoleHistoryInstant(cv['title']);
      userInterfaceObject.updateConsoleHistory(
        cv['headings'][number] + "\n\n" + cv['content+'][number]
      );
    }

    var commandSplit = command.toLowerCase().split(/[ ]+/);
    switch (commandSplit[0]) {
      case "c":
        subsection(0);
        return "";
        break;
      case "e":
        subsection(1);
        return "";
        break;
      case "h":
        subsection(2);
        return "";
        break;
      case "s":
        subsection(3);
        return "";
        break;
      case "o":
        subsection(4);
        return "";
        break;
      case "exit":
        userInterfaceObject.clearScreen();
        this.userInterface.commands = this.userInterface.commandsDefault;
        userInterfaceObject.updateConsoleHistory(userInterfaceObject.commands.consoleStart);
        return "";
        break;
      case "home":
        function typingPause() {
          if (cv !== undefined) {
            userInterfaceObject.clearScreen();
            userInterfaceObject.updateConsoleHistoryInstant(cv['title']);
            var i;
            for (i = 0; i < cv['headings'].length; i++) {
              userInterfaceObject.updateConsoleHistory(
                cv['headings'][i] + "\n\n" + cv['content'][i]
              );
            }
          } else {
            setTimeout(typingPause, userInterfaceObject.typeSpeed);
          }
        }
        typingPause();
        return "";
        break;
      default:
        return this.commands.consoleResponses['default'];
    }
  }
}
