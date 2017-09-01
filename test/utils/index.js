import utils from '../../src/utils'
import data from '../fixtures'
import test from 'ava'
import {prop, compose, tap} from 'ramda'

test('utils.parseAge', (assert) => {
  const {age} = data({})

  const expected = {years: 3, months: 6}
  const actual = utils.parseAge(age)

  assert.deepEqual(expected, actual)
})

test('utils.parseColor', (assert) => {
  const {color} = data({})

  const expected = ['smoke', 'black']
  const actual = utils.parseColor(color)

  assert.deepEqual(expected, actual)
})

test('utils.parseCurrency', (assert) => {
  const {adoptFee} = data({})

  const expected = 35.00
  const actual = utils.parseCurrency(adoptFee)

  assert.deepEqual(expected, actual)
})

test('utils.parseDateAvailable', (assert) => {
  const {dateAvailable} = data({})

  const expected = new Date(dateAvailable)
  const actual = utils.parseDateAvailable(dateAvailable)

  assert.deepEqual(expected, actual)
})

test('utils.parseDescription', (assert) => {
  const {description} = data({})

  const expected = "This is a description of an animal..."
  const actual = utils.parseDescription(description)

  assert.deepEqual(expected, actual)
})

test('utils.parseWeight', (assert) => {
  const {weight} = data({})

  const expected = 2.5
  const actual = utils.parseWeight(weight)

  assert.deepEqual(expected, actual)
})
