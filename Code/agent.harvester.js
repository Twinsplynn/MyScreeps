var roles = require('role.harvester');

var AgentHarvester = function(room){
    
    /* init memory */
    if (Memory.AgentHarvesters === undefined)
    {
        Memory.AgentHarvesters  = {};
    }
    
    if (Memory.AgentHarvesters[room.Name] === undefined)
    {
        Memory.AgentHarvesters[room.Name] = {Harvesters: [], };
    }
    
    this.Room = room;
    this.Memory = Memory.AgentHarvesters[room.Name];
    
    /* Execution Logic */
    this.Run = function(){
        workers.forEach(function(worker){
            roles.FindEnergy(worker);
            roles.TransferEnergy(worker);
        }, this);
    }

    this.Name = 'Harvester';
    
    var requestWorker = function(that, modules){
        var name = that.Room.Spawner.RequestWorker(modules, that.Name);
        that.Memory.Harvesters.push({Name: name});
    }

    var workers = {};
    this.Memory.Harvesters.forEach(function(name) {
        var work = this.Room.Spawner.Workers[name];
        if (work != undefined)
        {
            workers[name] = work;
            if (work.Job == undefined || work.Job.Role == undefined || work.Job.Role != 'harvester')
            {
                work.Job = {Role: 'harvester', Mining: true};
            }
        }
    }, this);

    /* Logics per level */
    var LevelOneLogic = function(that){
        // We are at level one, priority is to always have energy. 
        
        // We start with a simple harvester
        if (that.Memory.Harvesters.length < 2)
        {
            // request creep
            requestWorker(that, [WORK, CARRY, MOVE]);
        }
    }
    
    var LevelTwoLogic = function(that){
        // We are at level two, priority is to always have energy. 
        
        // Lets get more
        for(var i = that.Memory.Harvesters.length; i < 3; i++)
        {
            // request creep
            requestWorker(that, [WORK, CARRY, MOVE]);
        }
    }
    
    /* Do we need a harvester */
    switch(room.Level){
        case 1:
            LevelOneLogic(this);
            break;
        case 2:
            LevelTwoLogic(this);
            break;
        default:
            LevelOneLogic(this);
            break;
    }
    
    
};
module.exports = AgentHarvester;