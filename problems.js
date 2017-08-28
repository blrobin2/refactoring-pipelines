// Helpers
Array.prototype.delete = function(itemToDelete) {
	this.splice(this.findIndex(i => i === itemToDelete), 1)
}

Array.prototype.distinct = function() {
	return [...(new Set(this))]
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
		const result = []
		for (let a of authors) {
			if (a.company === company) {
				const handle = a.twitterHandle
				if (handle) {
					result.push(handle)
				}
			}
		}

		return result
	}
}

// Nested loop - reader of books
function getReadersOfBooks(readers, books, date) {
	class DataService {
		static getBooksReadOn(date) {
			return new Map([['Gary', ['Catcher in the Rye', 'The Sun Also Rises']], ['Carla', ['Dracula']]])
		}
	}
	
	const result = new Set()
	const data = DataService.getBooksReadOn(date)
	for (let [key, value] of data) {
		for (let bookId of books) {
			if (value.includes(bookId) && readers.includes(key)) {
				result.add(key)
			}
		}
	}

	return result
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
		const checkedRegions = new Set()
		for (let o1 of equipment.allOfferings()) {
			const r = o1.region
			if (checkedRegions.has(r)) {
				continue
			}

			let possPref = null
			for (let o2 of equipment.allOfferings(r)) {
				if (o2.isPreferred) {
					possPref = o2
					break
				} else {
					if (o2.isMatch || !possPref) {
						possPref = o2
					}
				}
			}
			possPref.isPreferred = true
			checkedRegions.add(r)
		}
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
	const count = {}
	const cancellations = {}
	const totalDelay = {}
	for (let row of data) {
		const airport = row.dest
		if (count[airport] === undefined) {
			count[airport] = 0
			cancellations[airport] = 0
			totalDelay[airport] = 0
		}
		count[airport]++
		if (row.cancelled) {
			cancellations[airport]++
		} else {
			totalDelay[airport] += row.delay
		}
	}

	const result = {}
	for (let i in count) {
		result[i] = {}
		result[i].meanDelay = totalDelay[i] / (count[i] - cancellations[i])
		result[i].cancellationRate = cancellations[i] / count[i]
	}
	return result
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

		const used = []
		const foundRequired = []
		const dups = []

		for (let id of this.ids) {
			if (id.void) {
				continue
			}
			if (used.includes(id.scheme)) {
				dups.push(id.scheme)
			} else {
				for (let req of requiredSchemes) {
					if (id.scheme === req) {
						foundRequired.push(req)
						requiredSchemes.delete(req)
					}
				}
			}
			used.push(id.scheme)
		}

		if (dups.length > 0) {
			this.note.addError(`duplicate schemes: ${dups.join(', ')}`)
		}

		if (requiredSchemes.length > 0) {
			let missingNames = ''
			for (let req of requiredSchemes) {
				missingNames += (missingNames.length > 0) ? `, ${req}` : req
			}
			this.note.addError(`missing schemes: ${missingNames}`)
		}

		return this.note
	}
}

module.exports = { Author, getReadersOfBooks, Equipment, Service, airportData, Person, Identifier }