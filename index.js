#!/usr/bin/env node
const { throws } = require('assert');
const fs = require('fs')
const [program,, ...args] = process.argv

function readFile(name) {
	try {
		return fs.readFileSync(name, 'utf8');
	} catch (e) {
		console.error(`Error while reading the file ${name}:\n\n ${e}`)
		process.exit(1);
	}
}


// check arguments
if (args.length != 2) {
	console.error(`Usage of ${program}: ${program} inputFile ouputFile`);
	process.exit(1);
}


// read from input file
let data = readFile(args[0]);

// find script tags
const reScript = new RegExp('<script.*src=["\'](.*)["\'].*>.*</script>', 'g');
const scriptMatch = [...data.matchAll(reScript)];

// find script files and replace with content
scriptMatch.map(m => {
	const scriptData = '<script>' + readFile(m[1]) + '</script>';
	data = data.replace(m[0], scriptData);
})


// write to output file
try {
	fs.writeFileSync(args[1], data);
} catch (e) {
	console.error(`Error while writing to file ${args[1]}:\n\n ${e}`)
	process.exit(1);
}