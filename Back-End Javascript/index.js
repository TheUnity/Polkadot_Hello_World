const { ApiPromise, WsProvider } = require('@polkadot/api');
const readline = require('readline');
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
		});

async function main (query) {
	const wsProvider = new WsProvider('wss://rpc.polkadot.io');
	const api = await ApiPromise.create({ provider: wsProvider });
	await api.isReady;
	let request = query.split(' ');
	if (request.length == 1) {
		return await api.rpc.chain.getHeader();
	} else if (request[1] && !/[^[0-9]/.test(request[1])) {
		const hash = await api.rpc.chain.getBlockHash(request[1]);
		return await api.rpc.chain.getHeader(hash);
	} else {
		return await api.rpc.chain.getHeader(request[1]);
	}
}

async function runCommand(){
    try {
		console.clear();
		const answerCallback = async (answer) => {
			if (answer.includes('block')){
				response = await main(answer);
				console.log(`Last block number: ${response.number}`);
				console.log(`Hash: ${response.hash.toHuman()}`);
				console.log(`ParentHash: ${response.parentHash}`);
				rl.question(">", answerCallback);
			} else if (answer.toLowerCase() === "help") {
				console.log("Usage:\n\nblock - latest block\n\nblock [hash/number] - get block by hash/number");
				rl.question(">", answerCallback);
			} else if (answer.toLowerCase() === "exit") {
				console.log("Bye bye");
				process.exit();
			} else {
				console.log("Unknown command");
				rl.question(">", answerCallback);
			}
		}
		rl.question(">", answerCallback);
	} catch (error) {
		console.error(error.message);
	}
}

(async () => {
    await runCommand();
})();