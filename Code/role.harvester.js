var roleUpgrader = require('role.upgrader');
var Worker = require('agent.worker');

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

    Mining: function(that, worker){
        var source = worker.Creep.pos.findClosestByRange(FIND_SOURCES);
        if (source){
            if (worker.Creep.harvest(source) == ERR_NOT_IN_RANGE){
                worker.Creep.moveTo(source);
            }
        }
    },

    FindEnergy: function(that, worker){
        if (worker.Creep.carry.energy == worker.Creep.carryCapacity && worker.Job.Mining)
        {
            worker.Job.Mining = false;
            return;
        }
        if (worker.Creep.carry.energy < worker.Creep.carryCapacity && worker.Job.Mining)
        {
            var sources = worker.Creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
            if (sources){
                if(worker.Creep.pickup(sources) == ERR_NOT_IN_RANGE) {
                    worker.Creep.moveTo(sources);
                }
            }
        }
    },
    TransferEnergy: function(that, worker){
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
            // look for batteries
            that.GetBatteries().array.forEach(function(battery) {
                if (battery.Creep.carry.energy < battery.Creep.carryCapacity)
                {
                    if(worker.Creep.transfer(battery, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        worker.Creep.moveTo(battery.pos);
                    }
                    break;
                }
            }, this);
        }
    },
    Battery: function(that, worker){
        var dest = worker.Creep.room.find(FIND_FLAGS, {
            filter: (flag) => {
                return flag.color == COLOR_YELLOW && flag.secondaryColor == COLOR_WHITE;
            }
        });
        if (dest.length > 0)
        {
            worker.Job.BatteryPos = dest[0].pos;
            dest[0].remove();
        }

        if (worker.Job.BatteryPos != undefined && worker.Creep.pos != worker.Job.BatteryPos)
        {
            worker.Creep.moveTo(worker.Job.BatteryPos.x,worker.Job.BatteryPos.y);
        }
    }
};

module.exports = roleHarvester;