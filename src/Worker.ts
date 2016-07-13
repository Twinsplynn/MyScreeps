import * as __ from "lodash";
import {MemoryManager} from "./MemoryManager";
import { RoomController } from './RoomController';


export class CreepWorker
{
    
    private _modules : {Work: number, Carry: number, Move: number};
    protected _creep : Creep;
    private _memory : MemoryManager.workersType;
    private _name : string;
    protected _workToDo : () =>void;

    public get Memory():MemoryManager.workersType {
        return this._memory;
    }

    public get Carry():number{
        return this._creep.carry.energy;
    }
    public get Capacity():number{
        return this._creep.carryCapacity;
    }

    public get Creep():Creep{
        return this._creep;
    }

    constructor(creep: Creep)
    {
        this._creep = creep;
        this._memory = MemoryManager.memory.workers[creep.name];
        this.Memory.Spawning = false;
        this._name = creep.name;
        
        this._modules = {Work:0,Carry:0,Move:0};
        this._modules.Carry = __.filter<string>(this.Memory.Modules, name => {return name == "carry"}).length;
        this._modules.Work = __.filter<string>(this.Memory.Modules, name => {return name == "work"}).length;
        this._modules.Move = __.filter<string>(this.Memory.Modules, name => {return name == "move"}).length;

    }

    static CreateWorker(name: string, creep:Creep, room : RoomController) : CreepWorker{
        if (MemoryManager.memory.workers[name] == undefined)
        {
            return undefined;
        }

        switch (MemoryManager.memory.workers[name].Role)
        {
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

    public FindClosestByRange<T>(type : number) : T
    {
        return this._creep.pos.findClosestByPath<T>(type);
    }

    public Work(){
        this._workToDo();
    }
}   

export class Miner extends CreepWorker
{
    
    public GoMine(source?:Source)
    {
        if (!source){
            source = this.FindClosestByRange<Source>(FIND_SOURCES);
        }
        
        if (source){
            if (this._creep.harvest(source) == ERR_NOT_IN_RANGE){
                this._creep.moveTo(source);
            }
        }
    }
}

export class Transporter extends CreepWorker
{
    private _room : RoomController;

    public Init(room:RoomController)
    {
        this._room = room;
    }

    public FindEnergy()
    {
        let cr = this._creep;
        if (cr.carry.energy == cr.carryCapacity && this.Memory.Job["Mining"])
        {
            this.Memory.Job["Mining"] = false;
            return;
        }
        if (cr.carry.energy < cr.carryCapacity && this.Memory.Job["Mining"])
        {
            var sources = cr.pos.findClosestByRange<Resource>(FIND_DROPPED_ENERGY);
            if (sources){
                if(cr.pickup(sources) == ERR_NOT_IN_RANGE) {
                    cr.moveTo(sources);
                }
            }
        }
    }

    public Transport()
    {
        let cr = this._creep;
        if (cr.carry.energy == 0 && !this.Memory.Job["Mining"]){
            this.Memory.Job["Mining"] = true;
            return;
        }
        if (!this.Memory.Job["Mining"])
        {
            var targets = cr.room.find<Structure>(FIND_STRUCTURES, {
                        filter: (structure:any)  => {
                            return (structure.structureType == STRUCTURE_EXTENSION ||
                                    structure.structureType == STRUCTURE_SPAWN ||
                                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                        }
                });
            if(targets.length > 0) {
                if(cr.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    cr.moveTo(targets[0]);
                    
                }   
                
            }
            else{
                for (let worker in this._room.Spawn.Workers)
                {
                    if (this._room.Spawn.Workers[worker] instanceof Upgrader &&
                        this._room.Spawn.Workers[worker].Carry < this._room.Spawn.Workers[worker].Capacity)
                    {
                        if (this._creep.transfer(this._room.Spawn.Workers[worker].Creep, RESOURCE_ENERGY) != OK)
                        {
                            this._creep.moveTo(this._room.Spawn.Workers[worker].Creep.pos);
                        }
                    }
                }
            }
            
            // look for batteries
            /*that.GetBatteries().array.forEach(function(battery) {
                if (battery.Creep.carry.energy < battery.Creep.carryCapacity)
                {
                    if(cr.transfer(battery.Creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        cr.moveTo(battery.Creep.pos);
                    }
                    return;
                }
            }, this);*/
        }    
    }
}

export class Upgrader extends CreepWorker
{
    public Upgrade()
    {
        if (this._creep.ticksToLive == 1500)
        {
            this.Memory.Job["AtLocation"] = false;
        }

        if (!this.Memory.Job["AtLocation"])
        {
            this._creep.moveTo(this._creep.room.controller.pos);
            this.Memory.Job["AtLocation"] = this._creep.pos.getRangeTo(this._creep.room.controller.pos) == 1;
        }

        
        if (this._creep.carry.energy > 0 && this.Memory.Job["AtLocation"])
        {
            this._creep.upgradeController(this._creep.room.controller);
        }
    }
}


