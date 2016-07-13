"use strict";
const MemoryManager_1 = require("./MemoryManager");
const Worker_1 = require('./Worker');
class SpawnController {
    constructor(room, spawn) {
        this._roomController = room;
        this._spawn = spawn;
        this._workers = {};
        if (MemoryManager_1.MemoryManager.memory.spawner == undefined) {
            MemoryManager_1.MemoryManager.memory.spawner = { Queue: new Array() };
        }
        if (MemoryManager_1.MemoryManager.memory.workers == undefined) {
            MemoryManager_1.MemoryManager.memory.workers = {};
        }
        this._queue = MemoryManager_1.MemoryManager.memory.spawner.Queue;
        for (let name in MemoryManager_1.MemoryManager.memory.workers) {
            let creep = Game.creeps[name];
            let mem = MemoryManager_1.MemoryManager.memory.workers[name];
            if (creep == undefined) {
                this.QueueSpawn(mem.Modules, mem.Name, undefined, mem.Role);
            }
            if (creep != undefined && !creep.spawning) {
                this._workers[creep.name] = Worker_1.CreepWorker.CreateWorker(creep.name, creep, this._roomController);
            }
        }
    }
    get Workers() {
        return this._workers;
    }
    QueueSpawn(modules, name, owner, role) {
        if (name == undefined) {
            name = Math.random().toString(36).substr(2, 5);
        }
        this._queue.push({ Modules: modules, Name: name, Owner: owner, Role: role });
        return name;
    }
    ;
    RequestWorker(modules, owner, role) {
        return this.QueueSpawn(modules, undefined, owner, role);
    }
    Execute() {
        if (this._queue.length > 0) {
            var info = this._queue.shift();
            if (this._spawn.canCreateCreep(info.Modules, info.Name) == OK) {
                this._spawn.createCreep(info.Modules, info.Name);
                MemoryManager_1.MemoryManager.memory.workers[info.Name] = { Modules: info.Modules, Name: info.Name, Spawning: true, Role: info.Role, Job: {} };
            }
            else {
                this._queue.unshift(info);
            }
        }
    }
}
exports.SpawnController = SpawnController;
