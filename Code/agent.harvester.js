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
        
    }

    this.Name = 'Harvester';
    
    var requestWorker = function(that, modules){
        var name = that.Room.Spawner.RequestWorker(modules, that.Name);
        that.Memory.Harvesters.push({Name: name, Created: false});
    }

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