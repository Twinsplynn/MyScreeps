import * as _ from "lodash";
import {RoomController} from "./RoomController";

export class World
{
    constructor(){
        // Let's get the rooms
        for(let room of _.values<Room>(Game.rooms))
        {
            let r = new RoomController(room);
        }
    }
}