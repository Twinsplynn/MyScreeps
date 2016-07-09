var roleUpgrader = require('role.upgrader');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.carry.energy < creep.carryCapacity) {
                    var sources = creep.room.find(FIND_SOURCES);
                    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0]);
                    }
                }
                else
                {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                    
                }
            }
	    
        else {
            
            roleUpgrader.run(creep);
        }
	},

    FindEnergy: function(worker){
        if (worker.Creep.carry.energy == worker.Creep.carryCapacity && worker.Job.Mining)
        {
            worker.Job.Mining = false;
            return;
        }
        if (worker.Creep.carry.energy < worker.Creep.carryCapacity && worker.Job.Mining)
        {
            var sources = worker.Creep.room.find(FIND_SOURCES);
                if(worker.Creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    worker.Creep.moveTo(sources[0]);
                }
        }
    },
    TransferEnergy: function(worker){
        if (worker.Creep.carry.energy == 0 && !worker.Job.Mining){
            worker.Job.Mining = true;
            return;
        }
        if (!worker.Job.Mining)
        {
            var targets = worker.Creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION ||
                                    structure.structureType == STRUCTURE_SPAWN ||
                                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                        }
                });
            if(targets.length > 0) {
                if(worker.Creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                   worker.Creep.moveTo(targets[0]);
                }   
                
            }
        }
    }
};

module.exports = roleHarvester;