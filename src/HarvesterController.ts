import {Miner, CreepWorker} from "./Worker"
import {MemoryManager} from "./MemoryManager"
import { RoomController } from './RoomController';

export class HarvesterController
{
    private _workers: CreepWorker[];
    private _room : RoomController;
    private _queue : string[];


    constructor(room :RoomController)
    {
        this._room = room;
        this._queue = MemoryManager.memory.harvester.Queue;
        this._workers = new Array<CreepWorker>();

        // Check for workers
        for(let name of this._queue)
        {
             var worker = this._room.Spawn.Workers[name];
             this._workers.push(worker);
        }

    }
    public Execute()
    {
        if (this._workers.length == 0)
        {
            // Create a Miner
            var name = this._room.Spawn.RequestWorker([WORK,WORK,MOVE], "harvester", "Miner");
            this._queue.push(name);
        }

        for(let worker of this._workers)
        {
            if (worker instanceof Miner)
            {
                (<Miner> worker).GoMine();
            }
        }
    }
}