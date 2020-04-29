export class CvRead {
  constructor(commands, userInterface) {
    this.userInterface = userInterface;
    this.commands = commands;
    this.readOld = commands.read;

    this.cv = undefined;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        this.cv = JSON.parse(this.responseText);
      }
    };
    xmlhttp.open("GET", "../data/cv.JSON", true);
    xmlhttp.send();
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

  subsection(number){
    this.userInterface.clearScreen();
    this.userInterface.consoleHistory = this.cv['title'];
    this.userInterface.updateConsoleHistory(
      this.cv['headings'][number] + "\n\n" + this.cv['content+'][number]
    );
  }

  read(command) {
    var commandSplit = command.toLowerCase().split(/[ ]+/);
    switch (commandSplit[0]) {
      case "c":
        this.subsection(0);
        break;
      case "e":
        this.subsection(1);
        break;
      case "h":
        this.subsection(2);
        break;
      case "s":
        this.subsection(3);
        break;
      case "o":
        this.subsection(4);
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
