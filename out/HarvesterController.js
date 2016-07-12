"use strict";
const Worker_1 = require("./Worker");
const MemoryManager_1 = require("./MemoryManager");
class HarvesterController {
    constructor(room) {
        this._room = room;
        if (MemoryManager_1.MemoryManager.memory.harvester == undefined) {
            MemoryManager_1.MemoryManager.memory.harvester = { Queue: new Array() };
        }
        this._queue = MemoryManager_1.MemoryManager.memory.harvester.Queue;
        this._workers = new Array();
        for (let name of this._queue) {
            var worker = this._room.Spawn.Workers[name];
            this._workers.push(worker);
        }
    }
    Execute() {
        if (this._workers.length == 0) {
            var name = this._room.Spawn.RequestWorker([WORK, WORK, MOVE], "harvester", "Miner");
            this._queue.push(name);
        }
        for (let worker of this._workers) {
            if (worker instanceof Worker_1.Miner) {
                worker.GoMine();
            }
        }
    }
}
exports.HarvesterController = HarvesterController;
