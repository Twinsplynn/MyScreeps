"use strict";
const Worker_1 = require("./Worker");
const MemoryManager_1 = require("./MemoryManager");
class BuilderController {
    constructor(room) {
        this._room = room;
        this._workers = new Array();
        if (MemoryManager_1.MemoryManager.memory.builders[room.Name] == undefined) {
            MemoryManager_1.MemoryManager.memory.builders[room.Name] = { Builders: new Array() };
        }
        this._memory = MemoryManager_1.MemoryManager.memory.builders[room.Name];
        this._name = "BuilderController";
        for (let name of this._memory.Builders) {
            var worker = this._room.Spawn.Workers[name];
            this._workers.push(worker);
        }
    }
    get Name() {
        return this._name;
    }
    firstLevel() {
        if (this._workers.length == 0) {
            var name = this._room.Spawn.RequestWorker([WORK, CARRY, CARRY, MOVE], this._name, "Upgrader");
            this._memory.Builders.push(name);
        }
        for (let worker of this._workers) {
            if (worker instanceof Worker_1.Upgrader) {
                worker.Upgrade();
            }
        }
    }
    Execute() {
        switch (this._room.Level) {
            case 1:
                this.firstLevel();
                break;
            default:
                break;
        }
    }
}
exports.BuilderController = BuilderController;
