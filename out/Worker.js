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
    get Carry() {
        return this._creep.carry.energy;
    }
    get Capacity() {
        return this._creep.carryCapacity;
    }
    get Creep() {
        return this._creep;
    }
    static CreateWorker(name, creep, room) {
        if (MemoryManager_1.MemoryManager.memory.workers[name] == undefined) {
            return undefined;
        }
        switch (MemoryManager_1.MemoryManager.memory.workers[name].Role) {
            case "Miner":
                return new Miner(creep);
            case "Transporter":
                let work = new Transporter(creep);
                work.Init(room);
                return work;
            case "Upgrader":
                return new Upgrader(creep);
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
class Transporter extends CreepWorker {
    Init(room) {
        this._room = room;
    }
    FindEnergy() {
        let cr = this._creep;
        if (cr.carry.energy == cr.carryCapacity && this.Memory.Job["Mining"]) {
            this.Memory.Job["Mining"] = false;
            return;
        }
        if (cr.carry.energy < cr.carryCapacity && this.Memory.Job["Mining"]) {
            var sources = cr.pos.findClosestByRange(FIND_DROPPED_ENERGY);
            if (sources) {
                if (cr.pickup(sources) == ERR_NOT_IN_RANGE) {
                    cr.moveTo(sources);
                }
            }
        }
    }
    Transport() {
        let cr = this._creep;
        if (cr.carry.energy == 0 && !this.Memory.Job["Mining"]) {
            this.Memory.Job["Mining"] = true;
            return;
        }
        if (!this.Memory.Job["Mining"]) {
            var targets = cr.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            if (targets.length > 0) {
                if (cr.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    cr.moveTo(targets[0]);
                }
            }
            else {
                for (let worker in this._room.Spawn.Workers) {
                    if (this._room.Spawn.Workers[worker] instanceof Upgrader &&
                        this._room.Spawn.Workers[worker].Carry < this._room.Spawn.Workers[worker].Capacity) {
                        if (this._creep.transfer(this._room.Spawn.Workers[worker].Creep, RESOURCE_ENERGY) != OK) {
                            this._creep.moveTo(this._room.Spawn.Workers[worker].Creep.pos);
                        }
                    }
                }
            }
        }
    }
}
exports.Transporter = Transporter;
class Upgrader extends CreepWorker {
    Upgrade() {
        if (this._creep.ticksToLive == 1500) {
            this.Memory.Job["AtLocation"] = false;
        }
        if (!this.Memory.Job["AtLocation"]) {
            this._creep.moveTo(this._creep.room.controller.pos);
            this.Memory.Job["AtLocation"] = this._creep.pos.getRangeTo(this._creep.room.controller.pos) == 1;
        }
        if (this._creep.carry.energy > 0 && this.Memory.Job["AtLocation"]) {
            this._creep.upgradeController(this._creep.room.controller);
        }
    }
}
exports.Upgrader = Upgrader;
