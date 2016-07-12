"use strict";
const _ = require("lodash");
const MemoryManager_1 = require("./MemoryManager");
class CreepWorker {
    constructor(creep) {
        this._creep = creep;
        this._memory = MemoryManager_1.MemoryManager.memory.workers[creep.name];
        this.Memory.Spawning = false;
        this._name = creep.name;
        this._modules.Carry = _.filter(this.Memory.Modules, name => { return name == "carry"; }).length;
        this._modules.Work = _.filter(this.Memory.Modules, name => { return name == "work"; }).length;
        this._modules.Move = _.filter(this.Memory.Modules, name => { return name == "move"; }).length;
    }
    get Memory() {
        return this._memory;
    }
}
exports.CreepWorker = CreepWorker;
