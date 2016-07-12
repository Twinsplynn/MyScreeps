declare let module: any;
import {MemoryManager} from "./MemoryManager";
import {World} from "./World"

module.exports.loop = function(){
    MemoryManager.loadMemory();
    let world = new World();
    world.Execute();
}
