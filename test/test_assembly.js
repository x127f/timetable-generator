const fs = require("fs");
const AsBind = require("as-bind/dist/as-bind.cjs.js");

const wasmModule = AsBind.instantiateSync(fs.readFileSync(__dirname + "/../build/optimized.wasm"), {
	index: {
		consoleLog: (message) => {
			console.log(message);
		},
	},
});

module.exports = wasmModule.exports;
