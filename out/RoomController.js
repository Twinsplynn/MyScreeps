"use strict";
const SpawnerController_1 = require('./SpawnerController');
const __ = require('lodash');
class RoomController {
    constructor(room) {
        this._room = room;
        this._spawnController = new SpawnerController_1.SpawnController(this, this._room.find(FIND_MY_SPAWNS)[0]);
        this._level = room.controller.level;
    }
    Execute() {
        this._spawnController.Execute();
    }
    get Level() {
        return this._level;
    }
    get Spawn() {
        return this._spawnController;
    }
    get Creepers() {
        return __.filter(__.values(Game.creeps), creep => { return creep.room == this._room; });
    }
}
exports.RoomController = RoomController;
