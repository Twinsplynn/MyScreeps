var AgentSpawner = require('agent.spawner');
var AgentHarvester = require('agent.harvester');
var AgentBuilder = require('agent.builder');

var AgentRoom = function(currentRoom){
    
    this.CurrentRoom = currentRoom;
    this.Level = currentRoom.controller.level;    
    this.Name = currentRoom.name;
    this.Spawner = new AgentSpawner(currentRoom.find(FIND_MY_SPAWNS)[0], this); // Will not scale
    this.Harvester = new AgentHarvester(this);
    this.Builder = new AgentBuilder(this);
    
    
    this.Run = function(){
        this.Spawner.Run();
        this.Harvester.Run();
       // this.Builder.Run();
    }
};

module.exports = AgentRoom;