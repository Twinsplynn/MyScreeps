var Worker = require('agent.worker');

var AgentSpawner = function(spawn, currentRoom){

	/* Init memory */
	if (Memory.AgentSpawn === undefined) {
		Memory.AgentSpawn = {Queue: []};
	}	
	if (Memory.Workers == undefined){
		Memory.Workers = {};
	}

	this.Workers = {};
    var QueueSpawn = function(priority, modules, name, owner){
	
		if (name == undefined)
		{
			name = Math.random().toString(36).substr(2, 5);
		}
		if (priority === true){
			Memory.AgentSpawn.Queue.unshift({Modules: modules, Name: name, Owner: owner});			
		}
		else{
			Memory.AgentSpawn.Queue.push({Modules: modules, Name: name, Owner: owner});			
		}
		return name;
	};

	// create all Workers
	for(var name in Memory.Workers){
		console.log(name);
		var creep = Game.creeps[name];
		var mem = Memory.Workers[name];

		if (creep == undefined)
		{
			// Has died. Let's check if was Keep
			if (mem.Keep && mem.Spawning == false)
			{
				QueueSpawn(false, mem.Modules, mem.Name, mem.Owner);
				mem.Spawning = true;
			}
		}
		else
		{
			var worker = new Worker(creep);
			this.Workers[worker.Name] = worker;
		}
	}

    this.Spawn = spawn;
    this.Room = currentRoom;

	this.RequestNonEssentialWorker = function(modules, owner){
		for(var i in this.Workers){
			if (this.Workers[i].Essential == Worker.JobPositionEnum.AVAILABLE && this.Workers[i].IsModuleSame(modules))
			{
				this.Workers[i].Essential = Worker.JobPositionEnum.SENCONDARY;
				return this.Workers[i].Name;
			}
		}
		return undefined;
	}

	this.RequestWorker = function(modules, owner){

		// first check if we have one that fits
		for(var i in this.Workers){
			if (!this.Workers[i].Essential && this.Workers[i].IsModuleSame(modules) && this.Workers[i].Owner != owner)
			{
				return this.Workers[i].Name;
			}
		}
		return QueueSpawn(false, modules, undefined, owner);
	}

	

	this.Run = function(){
		if (Memory.AgentSpawn.Queue.length > 0){
			var data = Memory.AgentSpawn.Queue.pop();
			
			if (this.Spawn.canCreateCreep(data.Modules, data.Name) == OK){
			    this.Spawn.createCreep(data.Modules, data.Name, undefined)
				Memory.Workers[data.Name] = {Owner: data.Owner, Modules: data.Modules, Spawning: true, Keep: true,  Essential: Worker.JobPositionEnum.CURRENT, Name: data.Name};
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
    
    

