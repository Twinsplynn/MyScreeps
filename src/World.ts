import * as __ from "lodash";
import {RoomController} from "./RoomController";

export class World
{
    constructor(){
        // Let's get the rooms
        for(let room of __.values<Room>(Game.rooms))
        {
            let r = new RoomController(room);
        }
    }
}