const ethers = require('ethers');
const {unsign} = require('@warren-bank/ethereumjs-tx-sign');
var request = require('request');

var url;

class Block {
    constructor(id, count, addresses) {
        this.id = id;
        this.count = count;
        this.wallets = addresses;
    }
}

class Address {
    constructor(publicKey, address, amount) {
        this.publicKey = publicKey;
        this.address = address;
        this.amount = amount;
    }
}

function send(block) {
    let requestBody = JSON.stringify(block);
    console.log(requestBody);
    request.post({
        url: url,
        body: block,
        json: true,
        keepAlive: true
    });
}

function check(blockId) {
    return request.get({url: url + blockId});
}

function randomIntFromInterval(min, max) {
    console.log("Generate random number between: " + min + " and " + max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function rusher(blockId, provider) {
    console.log("Rush");
    return new Promise(function (resolve, reject) {
        provider.getBlock(blockId)
            .then(function (block) {
                console.log("Block Number: " + blockId);
                if (block === null) {
                    resolve(blockId);
                }

                let transactions = block.transactions;
                console.log("Transactions: " + transactions.length);

                let promises = [];
                let addresses = [];
                for (let j = 0; j < transactions.length; j++) {
                    promises.push(
                        new Promise(function (resolve, reject) {
                            provider.getTransaction(transactions[j])
                                .then(function (transaction) {
                                    let rawMessage = transaction.raw;
                                    let {publicKey, address} = unsign(rawMessage);

                                    return new Promise(function (resolve, reject) {
                                        let entry = new Address(publicKey, address, 0);
                                        resolve(entry);
                                    });
                                })
                                .then(function (entry) {
                                    return new Promise(function (resolve, reject) {
                                        provider.getBalance(entry.address).then(function (balance) {
                                            entry.amount = balance.toString();
                                            resolve(entry)
                                        });
                                    })
                                })
                                .then(function (entry) {
                                    addresses.push(entry);
                                    resolve(entry);
                                });
                        }))
                }

                Promise.all(promises).then(function (addresses) {
                    addresses = addresses.filter(address => address.amount !== "0");
                    send(new Block(blockId, addresses.length, addresses));
                }).then(function () {
                    resolve(blockId);
                });
            })
            .catch(function () {
                resolve(blockId)
            });
    });
}

function run() {
    let providers = ethers.providers;
    let provider = providers.getDefaultProvider('mainnet');

    url = process.argv[2];
    if (url === undefined) {
        throw new Error('Collector url was not provided! ' +
            'URL should be provided as first argument.');
    }

    let blockId = process.argv[3];
    if (blockId === "latest") {
        provider.getBlockNumber().then(function (blockId) {
            createJob(blockId, provider);
        })
    }

    if (Number.isInteger(parseInt(blockId))) {
        createJob(blockId, provider);
    }
}

function createJob(blockId, provider) {
    console.log("Generate job for block: " + blockId);
    console.log("Check block for duplication: " + blockId);
    check(blockId).on('response', function (response) {
        if (response.statusCode === 404) {
            console.log("Processing...");
            rusher(blockId, provider)
                .then(function (blockId) {
                    createJob(--blockId, provider)
                });
        } else {
            console.log("Block already exist skipping...");
            blockId = randomIntFromInterval(5000000, blockId);
            let promise = createJob(blockId, provider);
            if (promise) {
                promise.then(function (blockId) {
                    createJob(--blockId, provider)
                })
            }
        }
    });
}

run();