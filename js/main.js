import {UserInterface, Commands} from './console.js';

var commands = new Commands("../data/console.JSON");
var userInterface = new UserInterface(commands, 'text');
userInterface.initialize();
