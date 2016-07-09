/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('state.zero');
 * mod.thing == 'a thing'; // true
 */

var stateZero = {
    
    run: function () {
        // We assume that we only have one spawn point here. 
        var spawn = _.values(Game.spawns)[0];

        if (Memory.StateZero === undefined)
        {
            Memory.StateZero = 1;
        }
        console.log(Memory.StateZero);
        
        // Here we decide on what needs to be created. 
        var creepsType = [
            'harvester',
            'upgrader',
            'harvester'
            ];
            
        // we spawn the creeps
        for(var i = 0; i <=  Memory.StateZero; i++){
            console.log('creep type: ' + creepsType[i]);
            var count = _.values(Game.creeps).filter(function (c) {
                return c.memory.role === creepsType[i];
            }).length;
            console.log(count);
            var need = 0;
            var current = 0;
            for(var el in creepsType)
            {
                if (creepsType[el] == creepsType[i] )
                {
                    need +=1;
                }
            }
            if (count < need){
                if (creepsType[i] === 'harvester')
                {
                    spawn.createCreep([WORK, CARRY, MOVE], '', {role: 'harvester'});
                }
                if (creepsType[i] === 'upgrader')
                {
                    spawn.createCreep([WORK, CARRY, MOVE], '', {role: 'upgrader'});
                }
                Memory.StateZero += 1;
            }
        }
    }
}
module.exports = stateZero;