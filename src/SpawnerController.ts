import {MemoryManager} from "./MemoryManager";
import { CreepWorker } from './Worker';
import { RoomController } from './RoomController';

export class SpawnController 
{
    private _roomController : RoomController;
    private _spawn : Spawn;
    private _workers : { [path:string]: CreepWorker }; 
    private _queue : [{modules: [string], name: string, owner: string}];

    

    constructor(room : RoomController, spawn: Spawn)
    {
        this._roomController = room;
        this._spawn = spawn;
        this._workers = {};
        
        // init memory
        this._queue = MemoryManager.memory.spawner.Queue;
    }   

    private  QueueSpawn (modules: [string], name: string, owner: string) :string
    {
		if (name == undefined)
		{
			name = Math.random().toString(36).substr(2, 5);
		}
		
		this._queue.push({modules, name, owner});			
		
		return name;
	};

    public RequestWorker(modules:[string], owner:string) : string
    {
        return this.QueueSpawn(modules, undefined, owner);
    }

}