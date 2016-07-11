var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
	    }
	},
	Upgrade: function(worker){
		if (worker.Job.Mining == false){
			if(worker.Creep.upgradeController(worker.Creep.room.controller) == ERR_NOT_IN_RANGE) {
				worker.Creep.moveTo(worker.Creep.room.controller);
			}

			if (worker.Creep.carry.energy == 0)
			{
				worker.Job.Mining = true;
			}
		}
    }
	
	
};

module.exports = roleBuilder;