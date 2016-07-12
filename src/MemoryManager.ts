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
        Queue: [{modules: [string], name: string, owner: string}];
    };
    
    workers: {
        [name: string]: {Modules:[string], Name:string, Spawning: boolean};
    };
}

export namespace MemoryManager {

  export let memory : GameMemory;

  export function loadMemory(): void {
    this.memory = Memory;
  }

}