var Worker = require("agent.worker");

var AgentBuilder = function(room){
    
    if (Memory.AgentBuilders === undefined)
    {
        Memory.AgentBuilders  = {};
    }
    
    if (Memory.AgentBuilders[room.Name] === undefined)
    {
        Memory.AgentBuilders[room.Name] = {Builders: [], TempBuilders: [], WorkOder: undefined};
    }
    
    this.Room = room;
    this.Memory = Memory.AgentBuilders[room.Name];
    this.Name = "AgentBuilder";

    var Level1Logic = function(that){
        // if (that.Memory.Builders.length == 0)
        // {
        //     // request temp worker
        //     var name = that.Room.Spawner.RequestWorker([WORK,CARRY,MOVE], that.Name);
        //     if (name != undefined)
        //     {
        //         that.Memory.Builders.push(name);
        //     }
        // }
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
            // request creep
            var name = that.Room.Spawner.RequestWorker([WORK, CARRY, MOVE], that.Name);
            that.Memory.Builders.push(name);
        }
    }
    
    
    
    
    var GetEnergy = function(worker) {
	    if(worker.Job.Mining ) {
	        
	        if (worker.Creep.carry.energy === worker.Creep.carryCapacity)
	        {
	            worker.Job.Mining = false;
	            return false;
	        }
	        
            var targets = worker.Creep.room.find(FIND_SOURCES);
            if(targets.length > 0) {

                if(worker.Creep.harvest(targets[0]) == ERR_NOT_IN_RANGE) {
                    worker.Creep.moveTo(targets[0]);
                }
                return true;
            }
            else
            {
                console.log('no targets');
            }
            
            
	    }
	    return false;
	}
	
	var Build =function(worker) {
	    if (worker.Job.Mining === undefined || !worker.Job.Mining){
	        if (worker.Creep.carry.energy === 0){
	            worker.Job.Mining = true;
	            return false;
	        }
	        var targets = worker.Creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(worker.Creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    worker.Creep.moveTo(targets[0]);
                }
                return true;
            }
            
	    }
	    return false;
	}
    var Upgrade = function(worker){
        if(worker.Creep.upgradeController(worker.Creep.room.controller) == ERR_NOT_IN_RANGE) {
                worker.Creep.moveTo(worker.Creep.room.controller);
            }
    }
    var jobs = 
    [
        GetEnergy,
        Build,
        Upgrade
    ];
    
    this.Run = function(){

        // Get Workers
        var workers = {};
        this.Memory.TempBuilders.forEach(function(name, index){
            var work = this.Room.Spawner.Workers[name];
            if (work.Essential == Worker.JobPositionEnum.CURRENT)
            {
                // Lost temp, remove 
                this.Memory.TempBuilders.splice(index, 1);
            }
        }, this);
        debugger;
        this.Memory.Builders.concat(this.Memory.TempBuilders).forEach(function(name, index) {
            var work = this.Room.Spawner.Workers[name];
            if (work != undefined)
            {
                
                if (work.Job == undefined || work.Job.Role == undefined || work.Job.Role != 'builder')
                {
                    work.Job = {Role: 'builder', Mining: true};
                }
                
                for(var job in jobs){
                    if (jobs[job](work))
                    {
                        break;
                    }
                }
            }
        }, this);


        
    }
    
    
    /* Do we need a builders */
    switch(room.Level){
        case 1:
            Level1Logic(this);
            break;
        case 2:
            LevelTwoLogic(this);
            break;
        
    }
};

module.exports = AgentBuilder;