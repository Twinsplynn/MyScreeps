"use strict";
const __ = require("lodash");
const RoomController_1 = require("./RoomController");
class World {
    constructor() {
        this._rooms = new Array();
        for (let room of __.values(Game.rooms)) {
            let r = new RoomController_1.RoomController(room);
            this._rooms.push(r);
        }
    }
    Execute() {
        for (let room of this._rooms) {
            room.Execute();
        }
    }
}
exports.World = World;
