
var AgentSpawner = function(spawn, currentRoom){

	/* Init memory */
	if (Memory.AgentSpawn === undefined) {
		Memory.AgentSpawn = {Queue: []};
	}	

    this.Spawn = spawn;
    this.Room = currentRoom;
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
    
    

