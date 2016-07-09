var Worker = require('agent.worker');

var AgentSpawner = function(spawn, currentRoom){

	/* Init memory */
	if (Memory.AgentSpawn === undefined) {
		Memory.AgentSpawn = {Queue: []};
	}	
	if (Memory.Workers == undefined){
		Memory.Workers = [];
	}

	this.Workers = {};

	// creat all Workers
	for(var index in Memory.Workers){
		var mem = Memory.Workers[index];
		var creep = Game.creeps[mem.Name];
		if (creep == undefined)
		{
			// Has died. Let's check if was Keep
			if (mem.Keep && mem.Spawning == false)
			{
				this.QueueSpawn(false, mem.Modules, mem.Name, undefined);
				mem.Spawning = true;
			}
		}
		else
		{
			var worker = new Worker(creep);
			this.Worker[worker.Name] = worker;
		}
	}

    this.Spawn = spawn;
    this.Room = currentRoom;

	this.RequestSpawn = function(modules){

		// first check if we have one that fits

	}

    this.QueueSpawn = function(priority, modules, name, memory){
	
		if (priority === true){
			Memory.AgentSpawn.Queue.unshift({Modules: modules, Name: name, Memory: memory});			
		}
		else{
			Memory.AgentSpawn.Queue.push({Modules: modules, Name: name, Memory: memory});			
		}
		
	};
	

	this.Run = function(){
		if (Memory.AgentSpawn.Queue.length > 0){
			var data = Memory.AgentSpawn.Queue.pop();
			
			if (this.Spawn.canCreateCreep(data.Modules, data.Name) == OK){
			    this.Spawn.createCreep(data.Modules, data.Name, data.Memory)

			}
			else
			{
			    console.log('could not create creep');
			    Memory.AgentSpawn.Queue.unshift(data); // could not create. 
			}
		}
	};
};
module.exports = AgentSpawner;
    
    

