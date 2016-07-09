/**
 * Worker represent a Creep
 */

var Worker = function(creep){

    var findModuleCount = function(name, modules){
        return _.filter(modules, function(m){ m == name}).length;
    }

    this.Creep = creep;
    this.Modules = {Work: findModuleCount.bind('WORK', this.Memory.Modules), Carry: findModuleCount.bind('CARRY', this.Memory.Modules), 
        Move: findModuleCount.bind('MOVE', this.Memory.Modules), Attack: findModuleCount.bind('ATTACK', this.Memory.Modules), 
        Ranged: findModuleCount.bind('RANGED_ATTACK', this.Memory.Modules), Heal: findModuleCount.bind('HEAL', this.Memory.Modules),
         Claim: findModuleCount.bind('CLAIM', this.Memory.Modules), Tough: findModuleCount.bind('TOUGH', this.Memory.Modules)};
    this.Name = creep.name;
    
    // initialize memory
    if (Memory.Workers[creep.name] == undefined)
    {
        Memory.Workers[creep.name] = {Owner: undefined, Essential: true, Keep: true, Name: undefined, Module: undefined, Spawning: true};
    }
    this.Memory = Memory.Workers[creep.name];
    
    this.__defineGetter__("Essential", function(){return this.Memory.Essential;});
    this.__defineSetter__("Essential", function(val){ this.Memory.Essential = val;});
    
    this.IsModuleSame = function(modules){
        return (this.Modules.Attack() == findModuleCount('ATTACK', modules) &&
            this.Modules.Work() == findModuleCount('WORK', modules) &&
            this.Modules.Carry() == findModuleCount('CARRY', modules) &&
            this.Modules.Move() == findModuleCount('MOVE', modules) &&
            this.Modules.Ranged() == findModuleCount('RANGED_ATTACK', modules) &&
            this.Modules.Heal() == findModuleCount('HEAL', modules) &&
            this.Modules.Claim() == findModuleCount('CLAIM', modules) &&
            this.Modules.Tough == findModuleCount('TOUGH', modules));
    }
};

module.exports = Worker;