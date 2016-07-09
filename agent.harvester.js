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
    
    /* Logics per level */
    var LevelOneLogic = function(that){
        // We are at level one, priority is to always have energy. 
        
        // We start with a simple harvester
        if (that.Memory.Harvesters.length < 2)
        {
            var name = Math.random().toString(36).substr(2, 5);
            // request creep
            that.Room.Spawner.QueueSpawn(true, [WORK, CARRY, MOVE], name, {role: 'harvester'});
            that.Memory.Harvesters.push({Name: name, Created: false});
        }
    }
    
    var LevelTwoLogic = function(that){
        // We are at level two, priority is to always have energy. 
        
        // Lets get more
        for(var i = that.Memory.Harvesters.length; i < 4; i++)
        {
            var name = Math.random().toString(36).substr(2, 5);
            // request creep
            that.Room.Spawner.QueueSpawn(true, [WORK, CARRY, MOVE], name, {role: 'harvester'});
            that.Memory.Harvesters.push({Name: name, Created: false});
        }
    }
    
    
    /* Make sure my harvesters are still alive */
    for(var creep in this.Memory.Harvesters){
        
        if (Game.creeps[this.Memory.Harvesters[creep].Name] === undefined)
        {
            if (!this.Memory.Harvesters[creep].Created)
            {
                console.log(this.Memory.Harvesters[creep].Name + ' not created yet');
            }
            else
            {
                console.log(this.Memory.Harvesters[creep].Name + ' is dead');
                this.Memory.Harvesters.splice(creep, 1);
            }            
        }
        else
        {
            if (!this.Memory.Harvesters[creep].Created)
            {
                this.Memory.Harvesters[creep].Created = true;
            }
            
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