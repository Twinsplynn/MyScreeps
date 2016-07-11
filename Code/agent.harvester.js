var roles = require('role.harvester');
var Worker = require("agent.worker");

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
        _.values(workers).forEach(function(worker){
            if (worker.Job.Role == 'harvester') 
            {
                roles.FindEnergy(worker);
                roles.TransferEnergy(worker);
            }
            else if (worker.Job.Role == 'miner')
            {
                roles.Mining(worker);
            }
        }, this);
    }

    this.Name = 'Harvester';
    
    var requestWorker = function(that, modules){
        var name = that.Room.Spawner.RequestWorker(modules, that.Name);
        that.Memory.Harvesters.push(name);
    }

    var workers = {};
    this.Memory.Harvesters.forEach(function(name, index) {
        var work = this.Room.Spawner.Workers[name];
        workers[name] = work;
        if (work != undefined && work.Essential == Worker.JobPositionEnum.CURRENT)
        {
            if (work.Job == undefined || work.Job.Role == undefined)
            {
                if (work.Modules.Work() > 1 && work.Modules.Carry())
                {
                    work.Job = {Role: 'miner', Mining: true};
                }
                else
                {
                    work.Job = {Role: 'harvester', Mining: true};
                }
            }
        }
    }, this);

    /* Logics per level */
    var LevelOneLogic = function(that){
        // We are at level one, priority is to always have energy. 
        
        if (that.Memory.Harvesters.length == 0)
        {
            // create miner
            requestWorker(that, [WORK, WORK, MOVE])
        }

        // We start with a simple harvester
        if (that.Memory.Harvesters.length < 2)
        {
            // request creep
            requestWorker(that, [CARRY, CARRY, MOVE, MOVE]);

        }
    }
    
    function LevelTwoLogic(that){
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