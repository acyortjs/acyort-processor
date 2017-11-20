const assert = require('power-assert')
const Processor = require('../')
const config = require('./fixtures/config.json')
const issues = require('./fixtures/issues.json')

const processor = new Processor(config)

processor.process(issues).then(res => console.log(res))
