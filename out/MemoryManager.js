"use strict";
class GameMemory {
}
var MemoryManager;
(function (MemoryManager) {
    function loadMemory() {
        this.memory = Memory;
        this.memory.workers = {};
    }
    MemoryManager.loadMemory = loadMemory;
})(MemoryManager = exports.MemoryManager || (exports.MemoryManager = {}));
