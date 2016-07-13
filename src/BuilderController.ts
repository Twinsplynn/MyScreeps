import {Miner, CreepWorker, Transporter, Upgrader} from "./Worker"
import {MemoryManager} from "./MemoryManager"
import { RoomController } from './RoomController';
import * as __ from 'lodash';
import { SpawnController } from './SpawnerController';

export class BuilderController
{
    private _room : RoomController;
    private _memory : MemoryManager.builders;
    private _name : string;
    private _workers : CreepWorker[];

    constructor(room : RoomController)
    {
        this._room = room;

        if (MemoryManager.memory.builders[room.Name] == undefined)
        {
            MemoryManager.memory.builders[room.Name] = {Builders : new Array<string>()};
        }

        this._memory = MemoryManager.memory.builders[room.Name];
        this._name = "BuilderController";   

        for(let name of this._memory.Builders)
        {
             var worker = this._room.Spawn.Workers[name];
             this._workers.push(worker);
        }
    }



    public get Name() : string{
        return this._name;
    }

    private firstLevel()
    {
        if (this._workers.length == 0)
        {
            var name = this._room.Spawn.RequestWorker([WORK,CARRY,CARRY,MOVE], this._name, "Upgrader");
            this._memory.Builders.push(name);
        }

        for(let worker of this._workers)
        {
            if (worker instanceof Upgrader)
            {
                (<Upgrader> worker).Upgrade();
            }
        }
    }

    public Execute()
    {
        switch (this._room.Level) {
            case 1:
                this.firstLevel();
                break;
        
            default:
                break;
        }

    }
}