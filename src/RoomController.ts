import { SpawnController } from './SpawnerController';
import * as __ from 'lodash';

export class RoomController
{
    private _spawnController : SpawnController;
    private _room : Room; 
    private _level : number;

    constructor(room : Room)
    {
        this._room = room;
        this._spawnController = new SpawnController(this, this._room.find<Spawn>(FIND_MY_SPAWNS)[0]);
        this._level = room.controller.level;
        

    }

    public Execute(){
        this._spawnController.Execute();
    }

    public get Level():number{
        return this._level;
    }

    public get Spawn(): SpawnController
    {
        return this._spawnController;
    }

    public get Creepers(): Creep[]
    {
        return __.filter<Creep>(__.values<Creep>(Game.creeps), creep => {return creep.room == this._room});
    }
}