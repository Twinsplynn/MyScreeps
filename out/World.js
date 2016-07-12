"use strict";
const __ = require("lodash");
const RoomController_1 = require("./RoomController");
class World {
    constructor() {
        for (let room of __.values(Game.rooms)) {
            let r = new RoomController_1.RoomController(room);
        }
    }
}
exports.World = World;
