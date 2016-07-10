/**
 * Worker represent a Creep
 */

var Worker = function(creep){

    var findModuleCount = function(name, modules){
        return modules.filter(function(m){ return (m == name)}).length;
    }

    this.Memory = Memory.Workers[creep.name];
    this.Memory.Spawning = false;

    this.Creep = creep;
    this.Modules = {Work: findModuleCount.bind(this, 'work', this.Memory.Modules), Carry: findModuleCount.bind(this, 'carry', this.Memory.Modules), 
        Move: findModuleCount.bind(this, 'move', this.Memory.Modules), Attack: findModuleCount.bind(this, 'attack', this.Memory.Modules), 
        Ranged: findModuleCount.bind(this, 'ranged_attack', this.Memory.Modules), Heal: findModuleCount.bind(this, 'heal', this.Memory.Modules),
         Claim: findModuleCount.bind(this, 'claim', this.Memory.Modules), Tough: findModuleCount.bind(this, 'tough', this.Memory.Modules)};
    this.Name = creep.name;
    
    
    
    this.__defineGetter__("Essential", function(){return this.Memory.Essential;});
    this.__defineSetter__("Essential", function(val){ this.Memory.Essential = val;});
    
    this.__defineGetter__("Job", function(){return Memory.Workers[creep.name].Job});
    this.__defineSetter__("Job", function(val){ Memory.Workers[creep.name].Job = val;});
    
    this.IsModuleSame = function(modules){
        return (this.Modules.Attack() == findModuleCount('attack', modules) &&
            this.Modules.Work() == findModuleCount('work', modules) &&
            this.Modules.Carry() == findModuleCount('carry', modules) &&
            this.Modules.Move() == findModuleCount('move', modules) &&
            this.Modules.Ranged() == findModuleCount('ranged_attack', modules) &&
            this.Modules.Heal() == findModuleCount('heal', modules) &&
            this.Modules.Claim() == findModuleCount('claim', modules) &&
            this.Modules.Tough() == findModuleCount('tough', modules));
    }
};
Worker.JobPositionEnum = {CURRENT: 0, SECONDARY: 1, AVAILABLE: 2};


module.exports = Worker;