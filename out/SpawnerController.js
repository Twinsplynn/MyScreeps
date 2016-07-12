"use strict";
const MemoryManager_1 = require("./MemoryManager");
class SpawnController {
    constructor(room, spawn) {
        this._roomController = room;
        this._spawn = spawn;
        this._workers = {};
        if (MemoryManager_1.MemoryManager.memory.spawner == undefined) {
            MemoryManager_1.MemoryManager.memory.spawner = { Queue: [{ Modules: new Array(), Name: "", Owner: "" }] };
        }
        this._queue = MemoryManager_1.MemoryManager.memory.spawner.Queue;
    }
    QueueSpawn(modules, name, owner) {
        if (name == undefined) {
            name = Math.random().toString(36).substr(2, 5);
        }
        this._queue.push({ Modules: modules, Name: name, Owner: owner });
        return name;
    }
    ;
    RequestWorker(modules, owner) {
        return this.QueueSpawn(modules, undefined, owner);
    }
}
exports.SpawnController = SpawnController;
