"use strict";
const SpawnerController_1 = require('./SpawnerController');
class RoomController {
    constructor(room) {
        this._room = room;
        this._spawnController = new SpawnerController_1.SpawnController(this, this._room.find(FIND_MY_SPAWNS)[0]);
        let name = this._spawnController.RequestWorker([WORK, CARRY, MOVE], "Test");
        console.log(name);
    }
    Execute() {
        this._spawnController.Execute();
    }
}
exports.RoomController = RoomController;
