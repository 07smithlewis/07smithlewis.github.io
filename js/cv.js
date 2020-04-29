export class CvRead {
  constructor(commands, userInterface) {
    this.userInterface = userInterface;
    this.commands = commands;
    this.readOld = commands.read;

    var cvDump = undefined;
    this.cv = undefined;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        cvDump = JSON.parse(this.responseText);
        console.log(cvDump);
      }
    };
    xmlhttp.open("GET", "../data/cv.JSON", true);
    xmlhttp.send();
    function setCv(cvReadObject) {
      if (cvDump == undefined) {
        setTimeout(setCv, 5, cvReadObject);
      } else {
        cvReadObject.cv = cvDump;
      }
    }
    setCv(this);

    console.log('stamp1');
    function typingPause() {
      if (userInterface.typing == 0 && cvDump !== undefined) {
        console.log('stamp2');
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
      this.userInterface.clearScreen();
      this.userInterface.consoleHistory = this.cv['title'];
      this.userInterface.updateConsoleHistory(
        this.cv['headings'][number] + "\n\n" + this.cv['content+'][number]
      );
    }

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
