import * as __ from "lodash";
import {RoomController} from "./RoomController";

export class World
{
    private _rooms : Array<RoomController>

    constructor(){
        this._rooms = new Array<RoomController>();

        // Let's get the rooms
        for(let room of __.values<Room>(Game.rooms))
        {
            let r = new RoomController(room);
            this._rooms.push(r);
        }
    }

    public Execute(){
        for(let room of this._rooms)
        {
            room.Execute();
        }
    }
}