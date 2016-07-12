import {MemoryManager} from "./MemoryManager";
import { CreepWorker } from './Worker';
import { RoomController } from './RoomController';

export class SpawnController 
{
    private _roomController : RoomController;
    private _spawn : Spawn;
    private _workers : { [path:string]: CreepWorker }; 
    private _queue : [{Modules: Array<string>, Name: string, Owner: string}];

    

    constructor(room : RoomController, spawn: Spawn)
    {
        this._roomController = room;
        this._spawn = spawn;
        this._workers = {};
        
        if (MemoryManager.memory.spawner == undefined)
        {
            MemoryManager.memory.spawner = {Queue: [{Modules: new Array<string>(), Name: "", Owner: ""}]}
        }

    
        // init memory
        this._queue = MemoryManager.memory.spawner.Queue;
    }   

    private  QueueSpawn (modules: [string], name: string, owner: string) :string
    {
		if (name == undefined)
		{
			name = Math.random().toString(36).substr(2, 5);
		}
		
		this._queue.push({Modules: modules, Name: name, Owner: owner});			
		
		return name;
	};

    public RequestWorker(modules:[string], owner:string) : string
    {
        return this.QueueSpawn(modules, undefined, owner);
    }

    public Execute(){
        if (this._queue.length > 0)
        {
            var info = this._queue.shift();
            if (this._spawn.canCreateCreep(info.Modules, info.Name) == OK)
            {
                this._spawn.createCreep(info.Modules, info.Name);
            }
            else
            {
                this._queue.unshift(info);
            }
        }
    }

}