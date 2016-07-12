import * as __ from "lodash";
import {MemoryManager} from "./MemoryManager";


export class CreepWorker
{
    
    private _modules : {Work: number, Carry: number, Move: number};
    private _creep : Creep;
    private _memory : {Modules:Array<string>, Name:string, Spawning: boolean};
    private _name : string;

    public get Memory():{Modules:Array<string>, Name:string, Spawning: boolean} {
        return this._memory;
    }


    constructor(creep: Creep)
    {
        this._creep = creep;
        this._memory = MemoryManager.memory.workers[creep.name];
        this.Memory.Spawning = false;
        this._name = creep.name;

        this._modules.Carry = __.filter<string>(this.Memory.Modules, name => {return name == "carry"}).length;
        this._modules.Work = __.filter<string>(this.Memory.Modules, name => {return name == "work"}).length;
        this._modules.Move = __.filter<string>(this.Memory.Modules, name => {return name == "move"}).length;

    }
}   

