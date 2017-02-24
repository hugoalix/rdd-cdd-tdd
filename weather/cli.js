#!/usr/bin/env node
'use strict';

const meow = require('meow');
const chalk = require('chalk');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const weather = require('./');

const cli = meow({
	help: [
		'Usage',
		'  $ weather <input>',
		'',
		'Options',
		'  city [Default: Dhaka]',
		'  country [Default: Bangladesh]',
		'  scale (C/F) [Default: Celcius]',
		'',
		'Examples',
		'  $ weather London UK C',
		'  London, UK',
		'  Condition: Partly Cloudy',
		'  Temperature: 32C'
	]
});

function _toCelcius(temp) {
	return Math.round(((temp - 32) * 5) / 9);
}

updateNotifier({ pkg}).notify();

weather(cli.input, (err, result) => {
	if (err) //if there are error, you go out
	{
		console.log(chalk.bold.red(err));
		process.exit(1);
	}

	let condition = result.query.results.channel.item.condition.text;
	let temperature;

	if (cli.input[2] && cli.input[2] === 'C') {
		temperature = _toCelcius(result.query.results.channel.item.condition.temp) + 'C';
	} else if (cli.input[2] && cli.input[2] === 'F') {
		temperature = result.query.results.channel.item.condition.temp + 'F';
	} else {
		temperature = _toCelcius(result.query.results.channel.item.condition.temp) + 'C';
	}

	let city = cli.input[0] ? cli.input[0] : 'Dhaka'; //take the city which has been enter, if there are not, it take default value 
	let country = cli.input[1] ? cli.input[1] : 'Bangladesh'; //take the city which has been enter, if there are not, it take default value 

	console.log(chalk.red(city + ', ' + country));
	console.log(chalk.cyan('Condition: ' + chalk.yellow(condition)));
	console.log(chalk.cyan('Temperature: ' + chalk.yellow(temperature)));//print the different value
	process.exit();
});
