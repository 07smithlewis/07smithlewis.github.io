import {jsonLoader} from 'jsonLoader.js';

export class CvRead {
  constructor(commands, userInterface) {
    this.userInterface = userInterface;
    this.commands = commands;
    this.readOld = commands.read;

    var cvDump = jsonLoader('../data/cv.JSON');
    this.cv = cvDump;

    function typingPause() {
      if (userInterface.typing == 0 && cvDump !== undefined) {
        userInterface.clearScreen();
        userInterface.updateConsoleHistory(cvDump['title']);
        var i;
        for (i = 0; i < cvDump['headings'].length; i++) {
          userInterface.updateConsoleHistory(
            cvDump['headings'][i] + "\n\n" + cvDump['content'][i]
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

  read(command) {
    function subsection(number) {
      userInterface.clearScreen();
      userInterface.consoleHistory = this.cv['title'];
      userInterface.updateConsoleHistory(
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
          if (this.userInterface.typing == 0 && this.cv !== undefined) {

            this.userInterface.clearScreen();
            this.userInterface.updateConsoleHistory(this.cv['title']);
            var i;
            for (i = 0; i < this.cv['headings'].length; i++) {
              this.userInterface.updateConsoleHistory(
                this.cv['headings'][i] + "\n\n" + this.cv['content'][i]
              );
            }
          } else {
            setTimeout(typingPause, this.userInterface.typeSpeed);
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
