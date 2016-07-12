"use strict";
const MemoryManager_1 = require("./MemoryManager");
const World_1 = require("./World");
module.exports.loop = function () {
    MemoryManager_1.MemoryManager.loadMemory();
    let world = new World_1.World();
};
