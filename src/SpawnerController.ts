import {MemoryManager} from "./MemoryManager";
import { CreepWorker } from './Worker';
import { RoomController } from './RoomController';
import * as __ from 'lodash';

export class SpawnController 
{
    private _roomController : RoomController;
    private _spawn : Spawn;
    private _workers : { [path:string]: CreepWorker }; 
    private _queue : Array<{Modules: Array<string>, Name: string, Owner: string, Role: string}>;

    public get Workers(): { [path:string]: CreepWorker }{
        return this._workers;
    }

    constructor(room : RoomController, spawn: Spawn)
    {
        this._roomController = room;
        this._spawn = spawn;
        this._workers = {};
        
        // init memory
        if (MemoryManager.memory.spawner == undefined)
        {
            MemoryManager.memory.spawner = {Queue: new Array<{Modules: Array<string>, Name: string, Owner: string, Role:string}>()}
        }
        if (MemoryManager.memory.workers == undefined)
        {
            MemoryManager.memory.workers = {};
        }
        this._queue = MemoryManager.memory.spawner.Queue;

        for(let name in MemoryManager.memory.workers)
        {
            let creep = Game.creeps[name];
            let mem = MemoryManager.memory.workers[name];
            if (creep == undefined)
            {
                this.QueueSpawn(mem.Modules, mem.Name, undefined, mem.Role);
            }
            if (creep != undefined && !creep.spawning)
            {
                // create worker 
                this._workers[creep.name] = CreepWorker.CreateWorker(creep.name, creep, this._roomController);
            }

        }

    }   

    private  QueueSpawn (modules: string[], name: string, owner: string, role: string) :string
    {
		if (name == undefined)
		{
			name = Math.random().toString(36).substr(2, 5);
		}
		
		this._queue.push({Modules: modules, Name: name, Owner: owner, Role: role});			
		
		return name;
	};

    public RequestWorker(modules:[string], owner:string, role:string) : string
    {
        return this.QueueSpawn(modules, undefined, owner, role);
    }

    public Execute(){
        if (this._queue.length > 0)
        {
            var info = this._queue.shift();
            if (this._spawn.canCreateCreep(info.Modules, info.Name) == OK)
            {
                this._spawn.createCreep(info.Modules, info.Name);
                // Create memory for workers
                MemoryManager.memory.workers[info.Name] = {Modules: info.Modules, Name: info.Name, Spawning : true, Role: info.Role, Job: {}};
            }
            else
            {
                this._queue.unshift(info);
            }
        }
    }

}