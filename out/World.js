"use strict";
const _ = require("lodash");
const RoomController_1 = require("./RoomController");
class World {
    constructor() {
        for (let room of _.values(Game.rooms)) {
            let r = new RoomController_1.RoomController(room);
        }
    }
}
exports.World = World;
