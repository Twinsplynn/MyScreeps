import {Miner, CreepWorker, Transporter} from "./Worker"
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

        if (MemoryManager.memory.harvester == undefined)
        {
            MemoryManager.memory.harvester = {Queue: new Array<string>()};
        }

        this._queue = MemoryManager.memory.harvester.Queue;
        this._workers = new Array<CreepWorker>();

        // Check for workers
        for(let name of this._queue)
        {
             var worker = this._room.Spawn.Workers[name];
             this._workers.push(worker);
        }

    }

    private LevelOne = function(){
        if (this._workers.length == 0)
        {
            // Create a Miner
            var name = this._room.Spawn.RequestWorker([WORK,WORK,MOVE], "harvester", "Miner");
            this._queue.push(name);
        }

        if (this._workers.length == 1)
        {
            // Create a Miner
            var name = this._room.Spawn.RequestWorker([CARRY, CARRY, MOVE, MOVE], "harvester", "Transporter");
            this._queue.push(name);
        }

        for(let worker of this._workers)
        {
            if (worker instanceof Miner)
            {
                (<Miner> worker).GoMine();
            }
            else if (worker instanceof Transporter)
            {
                (<Transporter> worker).FindEnergy();
                (<Transporter> worker).Transport();
            }
        }

    }
    
    public Execute()
    {
        switch (this._room.Level) {
            case 1:
                this.LevelOne();
                break;
        
            default:
                break;
        }
    }
}