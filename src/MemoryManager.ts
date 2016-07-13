

class GameMemory implements Memory
{
    creeps: {
        [name: string]: any;
    };
    flags: {
        [name: string]: any;
    };
    rooms: {
        [name: string]: any;
    };
    spawns: {
        [name: string]: any;
    };
    spawner: {
        Queue: Array<{Modules: Array<string>, Name: string, Owner: string, Role: string}>;
    };
    
    workers: {
        [name:string] :MemoryManager.workersType;
    }
    harvester: {Queue: string[]};

    builders : {[room:string]: MemoryManager.builders};
}

export namespace MemoryManager {

  export let memory : GameMemory;
  
  export type workersType = {Modules:Array<string>, Name:string, Spawning: boolean, Role: string, Job: {[key : string]: any}};
  export type builders = {Builders: string[]};

  export function loadMemory(): void {
    this.memory = Memory;
    if (this.memory.builders == undefined)
    {
        this.memory.builders = {};
    }
  }

}