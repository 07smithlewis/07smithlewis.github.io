function jsonLoader(file, callback, cvReadObject) {
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
      callback(json, cvReadObject);
    }
  }
  returnJson();
}

export class CvRead {
  constructor(commands, userInterface) {
    this.userInterface = userInterface;
    this.commands = commands;
    this.readOld = commands.read;

    function jsonLoaded(jsonDump, cvReadObject) {
      cvReadObject.cv = jsonDump;
    }
    jsonLoader('../data/cv.JSON', jsonLoaded, this);

    function typingPause() {
      if (userInterface.typing == 0 && this.cv !== undefined) {
        userInterface.clearScreen();
        userInterface.updateConsoleHistory(this.cv['title']);
        var i;
        for (i = 0; i < this.cv['headings'].length; i++) {
          userInterface.updateConsoleHistory(
            this.cv['headings'][i] + "\n\n" + this.cv['content'][i]
          );
        }
      } else {
        setTimeout(typingPause, userInterface.typeSpeed);
      }
    }
    typingPause();
  }

  resetRead() {
    this.commands.read = this.readOld;
  }

  read(command, userInterfaceObject) {
    function subsection(number) {
      userInterfaceObject.clearScreen();
      userInterfaceObject.consoleHistory = this.cv['title'];
      userInterfaceObject.updateConsoleHistory(
        this.cv['headings'][number] + "\n\n" + this.cv['content+'][number]
      );
    }

    var commandSplit = command.toLowerCase().split(/[ ]+/);
    switch (commandSplit[0]) {
      case "c":
        subsection(0);
        break;
      case "e":
        subsection(1);
        break;
      case "h":
        subsection(2);
        break;
      case "s":
        subsection(3);
        break;
      case "o":
        subsection(4);
        break;
      case "exit":
        this.resetRead();
        break;
      case "home":
        function typingPause() {
          if (userInterfaceObject.typing == 0 && this.cv !== undefined) {

            userInterfaceObject.clearScreen();
            userInterfaceObject.updateConsoleHistory(this.cv['title']);
            var i;
            for (i = 0; i < this.cv['headings'].length; i++) {
              userInterfaceObject.updateConsoleHistory(
                this.cv['headings'][i] + "\n\n" + this.cv['content'][i]
              );
            }
          } else {
            setTimeout(typingPause, userInterfaceObject.typeSpeed);
          }
        }
        typingPause();
        break;
      default:
        return this.commands.consoleResponses['default'];
    }
  }

  overrideRead() {
    this.commands.read = this.read;
  }
}
