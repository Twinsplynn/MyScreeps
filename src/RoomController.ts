import { SpawnController } from './SpawnerController';

export class RoomController
{
    private _spawnController : SpawnController;
    private _room : Room; 

    constructor(room : Room)
    {
        this._room = room;
        this._spawnController = new SpawnController(this, this._room.find<Spawn>(FIND_MY_SPAWNS)[0]);

        // test
        let name = this._spawnController.RequestWorker([WORK, CARRY, MOVE], "Test");
        console.log(name);
    }

    public Execute(){
        this._spawnController.Execute();
    }
}