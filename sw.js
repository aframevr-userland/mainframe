const sw = require('./lib/sw.js');

const hashes = require('../.hashes.json');

module.exports = sw(hashes.public);
