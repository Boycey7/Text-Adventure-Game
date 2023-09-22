class Room {
  constructor(name, description) {
    this._name = name;
    this._description = description;
    this._linkedRooms = {};
    this._character = "";
    this._items = [];
  }

  set items(newItem) {
    if (Array.isArray(newItem)) {
      return;
    }
    this._items.push(newItem);
  }

  get items() {
    return this._items;
  }

  set character(value) {
    this._character = value;
  }

  get character() {
    return this._character;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  set name(value) {
    if (value.length < 4) {
      alert("Name is too short.");
      return;
    }
    this._name = value;
  }

  set description(value) {
    if (value.length < 4) {
      alert("Description is too short.");
      return;
    }
    this._description = value;
  }

  describe() {
    return this._name + ": " + this._description;
  }

  linkRoom(direction, roomToLink) {
    this._linkedRooms[direction] = roomToLink;
  }

  move(direction) {
    if (direction in this._linkedRooms) {
      return this._linkedRooms[direction];
    } else {
      alert("That way is blocked.");
      return this; // Return the current room if the direction is blocked
    }
  }
}

class Character {
  constructor(name, description, conversation) {
    this._name = name;
    this._description = description;
    this._conversation = conversation;
    this._swordInInventory = false;
  }

  set name(value) {
    if (value.length < 4) {
      alert("Name is too short.");
      return;
    }
    this._name = value;
  }

  set description(value) {
    if (value.length < 4) {
      alert("Description is too short.");
      return;
    }
    this._description = value;
  }

  set conversation(value) {
    if (value.length < 4) {
      alert("Conversation is too short.");
      return;
    }
    this._conversation = value;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get conversation() {
    return this._conversation;
  }

  describe() {
    let description = `You have met ${this._name}, ${this._name} is ${this._description}.`;
    if (this._swordInInventory) {
      description += " You are carrying a sword.";
    }
    return description;
  }

  talk() {
    return `${this._name} says '${this._conversation}'`;
  }
}
class EnemyCharacter extends Character {
  constructor(name, description, conversation) {
    super(name, description, conversation);
  }
}

const forest = new Room("Forest", "This is a dark and mysterious forest.");
const castleEntrance = new Room(
  "Castle Entrance",
  "A Great Castle Stands Infront of you with towering doors."
);
const grandHall = new Room(
  "Grand Hall",
  "A vast hall with a high ceiling, chandeliers, and a red carpet."
);
const lake = new Room("Lake", "long vast lake");
const armory = new Room(
  "Armory",
  "Rows of medieval weaponry, A faint metallic scent lingers in the air."
);
const library = new Room(
  "Library",
  "Rows of bookshelves filled with books of forbidden knowledge."
);
const diningHall = new Room(
  "Dining Hall",
  "A long table, covered in cobwebs. Moonlight filters in through the windows."
);
const throneRoom = new Room(
  "Throne Room",
  "A massive throne and crimson carpet. Dark and mysterious."
);

// Items in rooms
armory.items = "Sword";
castleEntrance.items = "door";

// Linked Rooms
forest.linkRoom("west", castleEntrance);
forest.linkRoom("east", lake);
lake.linkRoom("west", forest);
castleEntrance.linkRoom("north", grandHall);
castleEntrance.linkRoom("east", forest);
grandHall.linkRoom("south", castleEntrance);
grandHall.linkRoom("west", armory);
grandHall.linkRoom("east", diningHall);
grandHall.linkRoom("north", throneRoom);
armory.linkRoom("east", grandHall);
library.linkRoom("west", diningHall);
diningHall.linkRoom("west", grandHall);
diningHall.linkRoom("east", library);
throneRoom.linkRoom("south", grandHall);

const Dracula = new EnemyCharacter(
  "Dracula",
  "The fearsome vampire lord",
  "Prepare to meet your doom!"
);

throneRoom.character = Dracula;

const Villager = new Character(
  "Villager",
  "A scared local",
  "Beware of the castle..."
);

let currentRoom;

forest.character = Villager;

const displayRoomInfo = (room) => {
  let occupantMsg = "";

  if (room.character === "") {
    occupantMsg = "There is no one in this area";
  } else {
    occupantMsg = room.character.talk();
  }
  if (room.items.length > 0) {
    occupantMsg += " Items in this area: " + room.items.join(", ");
  }

  let textContent =
    "<p>" + room.describe() + "</p>" + "<p>" + occupantMsg + "</p>";

  if (room.name === "Forest") {
    textContent += "<p>You are East of a Castle</p>";
  } else if (room.name === "Lake") {
    textContent += "<p>You are West of the Forest</p>";
  } else if (room.name === "Grand Hall") {
    textContent += "<p>This is the main hall, a hallway to other rooms.</p>";
  }
  else if (room.name === "Dining Hall") {
    textContent += "<p>This is the Dining Hall, East of the Grand Hall.</p>";
  }
  else if (room.name === "Libary") {
    textContent += "<p>This is the Dining Hall, East of the Dining Hall.</p>";
  }
  
  

  document.getElementById("textarea").innerHTML = textContent;
  document.getElementById("usertext").value = "";
  document.getElementById("usertext").focus();
};

let lastAction = "";

// make an array of empty items
let usersCollectedItems = [];

const startgame = () => {
  currentRoom = forest;
  displayRoomInfo(currentRoom);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const command = document.getElementById("usertext").value.toLowerCase();
      const directions = ["north", "south", "east", "west"];
      const verbs = [
        "go north",
        "go south",
        "go east",
        "go west",
        "pickup",
        "open",
        "attack",
      ];
      if (directions.includes(command)) {
        currentRoom = currentRoom.move(command);
        displayRoomInfo(currentRoom);
      } else if (
        // direction based commands
        verbs.includes(command)
      ) {
        if (command.includes("go")) {
          const newCommand = command.split(" ");
          currentRoom = currentRoom.move(newCommand[1]);
          displayRoomInfo(currentRoom);
        } else if (command === "pickup") {
          if (currentRoom.name === "Armory" && currentRoom.items.includes("Sword")) {
            if (!usersCollectedItems.includes("Sword")) {
              usersCollectedItems.push("Sword");
              currentRoom.items = currentRoom.items.filter(item => item !== "Sword");
              console.log("You picked up the sword.");
              alert("You picked up the sword.");
              lastAction = "pickup";
            } else {
              console.log("You already have the sword.");
              alert("You already have the sword.");
            }
          } else {
            console.log("There is nothing to pickup here.");
            alert("There is nothing to pickup here.");
          }
        }

         else if (command === "open") {
          if (currentRoom.items.includes("door")) {
            usersCollectedItems = [
              ...usersCollectedItems,
              ...currentRoom.items,
            ];
            currentRoom.items = [];
            usersCollectedItems = new Set(usersCollectedItems);
            usersCollectedItems = Array.from(usersCollectedItems);
            console.log(usersCollectedItems);
            alert("You picked up the door.");
            const nextRoom = currentRoom.move("north");
            if (nextRoom) {
              currentRoom = nextRoom;
              displayRoomInfo(currentRoom);
              console.log("You moved to the next room (north).");
            } else {
              console.log("There's no room to the north.");
            }
          } else {
            console.log("There is no door to open.");
            alert("There is no door to open.");
          }
        
      } else if (command === "attack") {
        if (currentRoom.name === "Throne Room") {
          const enemy = currentRoom.character;
          if (enemy && enemy instanceof EnemyCharacter) {
            if (usersCollectedItems.includes("Sword")) {
              console.log("You won the game!");
              alert("You defeated Dracula and won the game!");
            } else {
              console.log("You lost the game!");
              alert("You needthe sword to defeat Dracula. You were defeated. Game Over.");
            }
          } else {
            console.log("There is no enemy to attack in this room.");
            alert("There is no enemy to attack in this room.");
          }
        } else {
          console.log("You can only attack in the Throne Room.");
          alert("You can only attack in the Throne Room.");
        }
        displayRoomInfo(currentRoom);
      } else {
        document.getElementById("usertext").value = "";
        alert("That is not a valid command.");
        return;
      }
    }
  }
});
};

console.log("online");

class Game {
  constructor() {
    this.startButton = document.getElementById("startButton");
    this.initialMessage = document.getElementById("initialMessage");
    this.gameArea = document.getElementById("gamearea");
    this.gameDetails = document.getElementById("details");
    this.textArea = document.getElementById("textarea");
    this.userText = document.getElementById("usertext");

    this.startButton.addEventListener("click", this.startGame.bind(this));
  }

  startGame() {
    this.initialMessage.style.display = "none";
    this.gameArea.style.display = "block";
    startgame();
  }

  displayMessage(message) {
    this.textArea.innerHTML = message;
  }

  getUserInput() {
    return this.userText.value.toLowerCase().trim();
  }
}

const game = new Game();
