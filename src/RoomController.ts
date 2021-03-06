import { SpawnController } from './SpawnerController';
import { HarvesterController } from './HarvesterController';
import { BuilderController } from './BuilderController';
import * as __ from 'lodash';

export class RoomController
{
    private _spawnController : SpawnController;
    private _harvester : HarvesterController;
    private _builder : BuilderController;
    private _room : Room; 
    private _level : number;

    constructor(room : Room)
    {
        this._room = room;
        this._spawnController = new SpawnController(this, this._room.find<Spawn>(FIND_MY_SPAWNS)[0]);
        this._harvester = new HarvesterController(this);
        this._builder = new BuilderController(this);
        this._level = room.controller.level;
        

    }

    public Execute(){
        this._spawnController.Execute();
        this._harvester.Execute();
        this._builder.Execute();
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

    public get Name() : string{
        return this._room.name;
    }
}