var AgentBuilder = function(room){
    
    if (Memory.AgentBuilders === undefined)
    {
        Memory.AgentBuilders  = {};
    }
    
    if (Memory.AgentBuilders[room.Name] === undefined)
    {
        Memory.AgentBuilders[room.Name] = {Builders: [], WorkOder: undefined};
    }
    
    this.Room = room;
    this.Memory = Memory.AgentBuilders[room.Name];
    
    
    /* Make sure my builders are still alive */
    for(var creep in this.Memory.Builders){
        
        if (Game.creeps[this.Memory.Builders[creep].Name] === undefined)
        {
            if (!this.Memory.Builders[creep].Created)
            {
                console.log(this.Memory.Builders[creep].Name + ' not created yet');
            }
            else
            {
                console.log(this.Memory.Builders[creep].Name + ' is dead');
                this.Memory.Builders.splice(creep, 1);
            }            
        }
        else
        {
            if (!this.Memory.Builders[creep].Created)
            {
                this.Memory.Builders[creep].Created = true;
            }
            
        }
    }
    
    
    
    
    
    
    
    var LevelTwoLogic = function(that){
        
        var flags = _.filter(Game.flags, function(flag){
            return flag.color === COLOR_GREEN && flag.secondaryColor === COLOR_YELLOW; // We get extensions
        });
    
        for(var f in flags){
            console.log(f);
            room.CurrentRoom.createConstructionSite(flags[f].pos, STRUCTURE_EXTENSION);
            flags[f].remove();
        }
        
        
        // We need one builder
        if (that.Memory.Builders.length == 0)
        {
            var name = Math.random().toString(36).substr(2, 5);
            // request creep
            that.Room.Spawner.QueueSpawn(false, [WORK, CARRY, MOVE], name);
            that.Memory.Builders.push({Name: name, Created: false});
        }
    }
    
    
    
    
    var GetEnergy = function(creep) {
	    if(creep.memory.drinking ) {
	        
	        if (_.sum(creep.carry) === creep.carryCapacity)
	        {
	            creep.memory.drinking = false;
	            return false;
	        }
	        
            var targets = creep.room.find(FIND_SOURCES);
            if(targets.length > 0) {

                if(creep.harvest(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else
            {
                console.log('no targets');
            }
            
            return true;
	    }
	    return false;
	}
	
	var Build =function(creep) {
	    if (creep.memory.drinking === undefined || !creep.memory.drinking){
	        console.log(creep);
	        if (_.sum(creep.carry) === 0){
	            creep.memory.drinking = true;
	            return false;
	        }
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            return true;
	    }
	    return false;
	}
    var jobs = 
    [
        GetEnergy,
        Build
    ];
    
    this.Run = function(){
        for(var index in this.Memory.Builders){
            if (this.Memory.Builders[index].Created){
                var creep = Game.creeps[this.Memory.Builders[index].Name];
                for(var job in jobs){
                    if (jobs[job](creep))
                    {
                        break;
                    }
                }
                
            }
        }
    }
    
    
    /* Do we need a builders */
    switch(room.Level){
        case 2:
            LevelTwoLogic(this);
            break;
        
    }
};

module.exports = AgentBuilder;