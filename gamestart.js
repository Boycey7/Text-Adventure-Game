class Room {
    constructor(name, description) {
      this._name = name;
      this._description = description;
      this._linkedRooms = {};
      this._character = "";
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
  const castleEntrance = new Room("Castle Entrance", "Big Scary Castle");
  const Lake = new Room("Lake", "long vast lake");
  
  forest.linkRoom("west", castleEntrance);
  forest.linkRoom("east", Lake);
  castleEntrance.linkRoom("north", forest);
  castleEntrance.linkRoom("east", Lake);
  
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
  
    let textContent = "<p>" + room.describe() + "</p>" + "<p>" + occupantMsg + "</p>";
    textContent += "<p>Location: East of Castle</p>";   

    document.getElementById("textarea").innerHTML = textContent;
    document.getElementById("usertext").value = "";
    document.getElementById("usertext").focus();
  };
  
  const startgame = () => {
    currentRoom = forest;
    displayRoomInfo(currentRoom);
  
    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const command = document.getElementById("usertext").value.toLowerCase();
        const directions = ["north", "south", "east", "west"];
        if (directions.includes(command)) {
          currentRoom = currentRoom.move(command);
          displayRoomInfo(currentRoom);
        } else {
          document.getElementById("usertext").value = "";
          alert("That is not a valid command.");
          return;
        }
      }
    });
  };
  
  startgame();
  