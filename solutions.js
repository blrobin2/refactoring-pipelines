// Helper Functions
const _ = require('underscore')

Array.prototype.distinct = function() {
	return [...(new Set(this))]
}

_.prototype.duplicates = function() {
	return this.groupBy(s => s)
		.pairs()
		.filter(([k, v]) => v.length > 1)
		.map(_.first)
}

function setIntersection(a, b) {
	return [...new Set(a.filter(x => b.includes(x)))]
}

function hasIntersection (a, b) {
	return setIntersection(a, b).length > 0
}

function setDifference(a, b) {
	return [...new Set(a.filter(x => !b.includes(x)))]
}

// Refactor a simple loop into a pipeline
class Author {
	constructor(name, twitterHandle, company) {
		this.name = name
		this.twitterHandle = twitterHandle
		this.company = company
	}

	static twitterHandles(authors, company) {
		return authors
			.filter(author =>
				author.company === company
				&& !!author.twitterHandle)
			.map(author =>
				author.twitterHandle)
	}
}

// Nested loop - reader of books
function getReadersOfBooks(readers, books, date) {
	class DataService {
		static getBooksReadOn(date) {
			return new Map([['Gary', ['Catcher in the Rye', 'The Sun Also Rises']], ['Carla', ['Dracula']]])
		}
	}

	const data = DataService.getBooksReadOn(date)
	return Array.from(data.entries())
		.filter(([key, value]) =>
			readers.includes(key)
			&& hasIntersection(value, books))
		.map(([key, _]) =>
			key)
}

// Equipment Offerings
const products = ['snow-blower', 'snow-shovel']
const regions = ['boston', 'miami']
const offerings =
	[ { region: 'boston', supported: 'snow-blower', supplied: 'snow-blower', isPreferred: true, isMatch: true }
	, { region: 'boston', supported: 'snow-blower', supplied: 'snow-shovel', isPreferred: false, isMatch: false }
	, { region: 'miami',  supported: 'snow-shovel', supplied: 'snow-blower', isPreferred: false, isMatch: false }
	]

class Equipment {
	static allOfferings(region = null) {
		if (region) {
			return offerings.filter(offering => offering.region === region)
		}

		return offerings
	}
}

class Service {
	static markPreferredOferrings(equipment) {
		equipment.allOfferings()
			.map(o =>
				o.region)
			.distinct()
			.map(r =>
				this.possiblePreference(equipment, r))
			.forEach(o => {
				o.isPreferred = true
			})
	}

	static possiblePreference(equipment, region) {
		const allOfferings = equipment.allOfferings(region)
		return allOfferings.find(o => o.isPreferred)
			|| allOfferings.reverse().find(o => o.isMatch)
			|| allOfferings[0]
	}
}

// Grouping flight records
function flightData() {
	return [{ origin: 'BOS', dest: 'LAX', date: '2015-01-12', number: 25, carrier: 'AA', delay: 0.0, cancelled: false}
		   ,{ origin: 'BOS', dest: 'LAX', date: '2015-01-13', number: 25, carrier: 'AA', delay: 0.1, cancelled: false}
		   ,{ origin: 'BOS', dest: 'LAX', date: '2015-01-14', number: 25, carrier: 'AA', delay: 0.0, cancelled: true}
		   ]
}

function airportData() {
	const data = flightData()
	const summarize = flights => ({
		numFlights:       flights.length,
		numCancellations: flights
							.filter(f => f.cancelled)
							.length,
		totalDelay:       flights
							.filter(f => !f.cancelled)
							.map(f => f.delay)
							.reduce((a,b) => a + b)
	})
	const formResult = airport => ({
		meanDelay:        airport.totalDelay /
							(airport.numFlights - airport.numCancellations),
		cancellationRate: airport.numCancellations / airport.numFlights
	})
	return _.chain(data)
		.groupBy(r => r.dest)
		.mapObject(summarize)
		.mapObject(formResult)
		.value()
}

// Identifiers
class Identifier {
	constructor(scheme, value, isVoid = false) {
		this.scheme = scheme
		this.value = value
		this.void = isVoid
	}
}

class Notification {
	constructor() {
		this.errors = []
	}
	addError(error) {
		this.errors.push(error)
	}
}

class Person {
	constructor(ids = []) {
		this.ids = ids
		this.note = null
	}

	checkValidIds(requiredSchemes = [], note = null) {
		this.note = note || new Notification
		if (this.ids.length < 1) {
			this.note.addError('has no ids')
		}
		const identitySchemes = _.chain(this.ids)
			.filter(id => !id.void)
			.map(id => id.scheme)
		const duplicates = identitySchemes.duplicates().value()
		if (duplicates.length > 0) {
			this.note.addError(`duplicate schemes: ${duplicates.join(', ')}`)
		}
		const missingSchemes = setDifference(requiredSchemes, identitySchemes.value())
				if (missingSchemes.length > 0) {
			this.note.addError(`missing schemes: ${missingSchemes.join(', ')}`)
		}

		return this.note
	}
}

module.exports = { Author, getReadersOfBooks, Equipment, Service, airportData, Person, Identifier }