const { get } = require('axios')
const { load: loadHtml } = require('cheerio')
const {buffer, text, json, send} = require('micro')

const ALL_ANIMALS_URL =
  'https://www.oregonhumane.org/adopt/?type=all'

const fetchAllAnimals =
  async () =>
    await get(ALL_ANIMALS_URL)

module.exports =
  async (request, response) => {
    const { data } = await fetchAllAnimals()
    const body = loadHtml(data)
    const allLinks = body('.animal-results .result-item')
    const results = allLinks.first().find('a').attr('href')
    return results
  }