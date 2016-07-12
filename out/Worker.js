"use strict";
const __ = require("lodash");
const MemoryManager_1 = require("./MemoryManager");
class CreepWorker {
    constructor(creep) {
        this._creep = creep;
        this._memory = MemoryManager_1.MemoryManager.memory.workers[creep.name];
        this.Memory.Spawning = false;
        this._name = creep.name;
        this._modules = { Work: 0, Carry: 0, Move: 0 };
        this._modules.Carry = __.filter(this.Memory.Modules, name => { return name == "carry"; }).length;
        this._modules.Work = __.filter(this.Memory.Modules, name => { return name == "work"; }).length;
        this._modules.Move = __.filter(this.Memory.Modules, name => { return name == "move"; }).length;
    }
    get Memory() {
        return this._memory;
    }
    static CreateWorker(name, creep) {
        if (MemoryManager_1.MemoryManager.memory.workers[name] == undefined) {
            return undefined;
        }
        if (MemoryManager_1.MemoryManager.memory.workers[name].Role == "Miner") {
            return new Miner(creep);
        }
    }
    FindClosestByRange(type) {
        return this._creep.pos.findClosestByPath(type);
    }
    Work() {
        this._workToDo();
    }
}
exports.CreepWorker = CreepWorker;
class Miner extends CreepWorker {
    GoMine(source) {
        if (!source) {
            source = this.FindClosestByRange(FIND_SOURCES);
        }
        if (source) {
            if (this._creep.harvest(source) == ERR_NOT_IN_RANGE) {
                this._creep.moveTo(source);
            }
        }
    }
}
exports.Miner = Miner;
