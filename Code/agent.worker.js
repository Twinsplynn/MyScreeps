/**
 * Worker represent a Creep
 */

var Worker = function(creep){

    var findModuleCount = function(name){
        return _.filter(this.Memory.Modules, function(m){ m == name}).length;
    }

    this.Creep = creep;
    this.Modules = {Work: findModuleCount.bind('WORK'), Carry: findModuleCount.bind('CARRY'), Move: findModuleCount.bind('MOVE'), Attack: findModuleCount.bind('ATTACK'), 
        Ranged: findModuleCount.bind('RANGED_ATTACK'), Heal: findModuleCount.bind('HEAL'), Claim: findModuleCount.bind('CLAIM'), Tough: findModuleCount.bind('TOUGH')};
    this.Name = creep.name;
    
    // initialize memory
    if (Memory.Workers[creep.name] == undefined)
    {
        Memory.Workers[creep.name] = {Owner: undefined, Essential: true, Keep: true, Name: undefined, Module: undefined, Spawning: true};
    }
    this.Memory = Memory.Workers[creep.name];
    
    this.__defineGetter__("Essential", function(){return this.Memory.Essential;});
    this.__defineSetter__("Essential", function(val){ this.Memory.Essential = val;});
    
};

module.exports = Worker;