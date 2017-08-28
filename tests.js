const scriptToTest = process.argv[3] === 'solutions' ? './solutions' : './problems'
const assert = require('chai').assert
const {
	Author,
	getReadersOfBooks,
	Equipment,
	Service,
	airportData,
	Person,
	Identifier
} = require(scriptToTest)

describe('Refactor a simple loop into a pipeline', () => {
	it ('gets twitter handles for a given list of authors and company', () => {
		const authors =
			[ {name: 'Gary', twitterHandle: '@gary', company: 'Apple'}
			, {name: 'Carla', twitterHandle: '@carla', company: 'Apple'}
			, {name: 'Jessica', twitterHandle: '@jessica', company: 'Microsoft'}
			].map(author =>
				new Author(author.name, author.twitterHandle, author.company))

		assert.deepEqual(Author.twitterHandles(authors, 'Apple'), [ '@gary', '@carla' ])
	})
})

describe('Nested loop - reader of books', () => {
	it ('gets readers of books on a given date', () => {
		const result = getReadersOfBooks(['Gary', 'Carla'], ['Dracula'], Date.now())
		assert.deepEqual([...result], [ 'Carla' ])
	})
})

describe('Equipment Offerings', () => {
	it ('marks possible equipment preferences', () => {
		assert.deepEqual(Equipment.allOfferings(),
			[{region: 'boston', supported: 'snow-blower', supplied: 'snow-blower', isPreferred: true, isMatch: true}
			,{region: 'boston', supported: 'snow-blower', supplied: 'snow-shovel', isPreferred: false, isMatch: false}
			,{region: 'miami',  supported: 'snow-shovel', supplied: 'snow-blower', isPreferred: false, isMatch: false}
			])
		Service.markPreferredOferrings(Equipment)
		assert.deepEqual(Equipment.allOfferings(),
			[{region: 'boston', supported: 'snow-blower', supplied: 'snow-blower', isPreferred: true, isMatch: true}
			,{region: 'boston', supported: 'snow-blower', supplied: 'snow-shovel', isPreferred: false, isMatch: false}
			,{region: 'miami',  supported: 'snow-shovel', supplied: 'snow-blower', isPreferred: true, isMatch: false}
			])
	})
})

describe('Group flight data', () => {
	it ('groups flight data', () => {
		assert.deepEqual(airportData(), { LAX: { meanDelay: 0.05, cancellationRate: 0.3333333333333333 } })
	})
})

describe('Identifiers', () => {
	it('doesnt check ids unless ids present', () => {
		const person = new Person()
		const note = person.checkValidIds()
		assert.deepEqual(note, { errors: [ 'has no ids' ] })
	})

	it('notifies if duplicate schemes are present', () =>  {
		const person = new Person([new Identifier('scheme1', 1), new Identifier('scheme2', 2), new Identifier('scheme2', 2)])
		const note = person.checkValidIds()
		assert.deepEqual(note, { errors: [ 'duplicate schemes: scheme2' ] })
	})

	it('skips void schemes', () => {
		const person = new Person([new Identifier('scheme1', 1), new Identifier('scheme2', 2), new Identifier('scheme2', 2, true)])
		const note = person.checkValidIds()
		assert.deepEqual(note, { errors: [] })
	})

	it('notifies if required schemes are missing', () => {
		const person = new Person([new Identifier('scheme1', 1), new Identifier('scheme2', 2), new Identifier('scheme3', 3)])
		const note = person.checkValidIds(['scheme1', 'scheme4'])
		assert.deepEqual(note, { errors: [ 'missing schemes: scheme4' ] })
	})

	it('doesnt notify if all required shemes are present', () => {
		const person = new Person([new Identifier('scheme1', 1), new Identifier('scheme2', 2), new Identifier('scheme3', 3)])
		const note = person.checkValidIds(['scheme1', 'scheme3'])
		assert.deepEqual(note, { errors: [] })
	})
})