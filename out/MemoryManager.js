"use strict";
class GameMemory {
}
var MemoryManager;
(function (MemoryManager) {
    function loadMemory() {
        this.memory = Memory;
        if (this.memory.builders == undefined) {
            this.memory.builders = {};
        }
    }
    MemoryManager.loadMemory = loadMemory;
})(MemoryManager = exports.MemoryManager || (exports.MemoryManager = {}));
