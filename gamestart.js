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
          return this;  // Return the current room if the direction is blocked
        }
      }
  }
  
  class Character {
    constructor(name, description, conversation) {
      this._name = name;
      this._description = description;
      this._conversation = conversation;
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
      return (
        "You have met " +
        this._name +
        ", " +
        this._name +
        " is " +
        this._description
      );
    }
  
    talk() {
      return this._name + " says '" + this._conversation + "'";
    }
  }
  
  console.log("online");
  
  const forest = new Room("Forest", "This is a dark and mysterious forest.");
  const castleEntrance = new Room("Castle Entrance", "A Great Castle Stands Infront of you with towering doors.");
  const grandHall = new Room("Grand Hall", "A vast hall with a high ceiling, chandeliers, and a red carpet.");
  const lake = new Room("Lake", "long vast lake");
  const armory = new Room("Armory", "Rows of medieval weaponry, A faint metallic scent lingers in the air.");
  const library = new Room("Library","Rows of bookshelves filled with books of forbidden knowledge.");
  const diningHall = new Room("Dining Hall","A long table, covered in cobwebs. Moonlight filters in through the windows.");
  const throneRoom = new Room("Throne Room","A massive throne and crimson carpet. Stained glass windows depict dark scenes from the castle's history.");

// Items in rooms
armory.items = "Sword"
castleEntrance.items = "door"



// Linked Rooms
  forest.linkRoom("west", castleEntrance);
  forest.linkRoom("east", lake);
  lake.linkRoom("west", forest);
  castleEntrance.linkRoom("north", grandHall);
  castleEntrance.linkRoom("west", armory);
  castleEntrance.linkRoom("east", forest);
  grandHall.linkRoom("south", castleEntrance);
  grandHall.linkRoom("west", armory);
  grandHall.linkRoom("west", library);
  grandHall.linkRoom("east", diningHall);
  grandHall.linkRoom("north", throneRoom);
  armory.linkRoom("east", castleEntrance);
  library.linkRoom("east", grandHall);
  diningHall.linkRoom("west", grandHall);
  throneRoom.linkRoom("south", grandHall);

  const Villager = new Character("Villager", "A scared local", "Beware of the castle...");
  
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

  
    let textContent = "<p>" + room.describe() + "</p>" + "<p>" + occupantMsg + "</p>";

    if (room.name === "Forest") {textContent += "<p>You are East of a Castle</p>";
  }   
    

    document.getElementById("textarea").innerHTML = textContent;
    document.getElementById("usertext").value = "";
    document.getElementById("usertext").focus();
  };

  // make an array of empty items 

  let usersCollectedItems = []
  
  const startgame = () => {
    currentRoom = forest;
    displayRoomInfo(currentRoom);
  
    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const command = document.getElementById("usertext").value.toLowerCase();
        const directions = ["north", "south", "east", "west"];
        const verbs = ["go north", "go south", "go east", "go west", "pickup", "open"];
        if (directions.includes(command)) {
          currentRoom = currentRoom.move(command);
          displayRoomInfo(currentRoom);
        } else if
        // direction based commands 
        (verbs.includes(command)) {
          if (command.includes("go")) {
            const newCommand = command.split(" ");
            currentRoom = currentRoom.move(newCommand[1]);
            displayRoomInfo(currentRoom);
          }

          else if (command === "pickup") {
            usersCollectedItems = [
              ...usersCollectedItems,
              ...currentRoom.items
            ]
            currentRoom.items = [];
            usersCollectedItems = new Set(
              usersCollectedItems
            );
            usersCollectedItems = Array.from(usersCollectedItems)
            console.log(usersCollectedItems);
          }

          else if (command === "open") {
            const doorIndex = currentRoom.items.indexOf("door");
            if (doorIndex !== -1) {
              usersCollectedItems.push("door");
              currentRoom.items.splice(doorIndex, 1);
              console.log("You opened the door.");
              if (currentRoom.name === "Castle Entrance") {
                currentRoom = currentRoom.move("west");
                displayRoomInfo(currentRoom);
                console.log("You moved to the Grand Hall.");
              }
            } else {
              alert("There is no door to open.");
            }
          }
        
     

        } else{
          document.getElementById("usertext").value = "";
          alert("That is not a valid command.");
          return;
        }
      }
    });
  };
  
  startgame();
  