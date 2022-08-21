import { getDOMByUrl } from './instrumental.js'
import fs from 'fs'

const speed = 100
const pathToFullList = 'result.txt'
const pathToResult = 'result-two.txt'
const domain = "https://reestr.nostroy.ru"

var resultIteration = []
var counter = 0
var source = fs.readFileSync(pathToFullList, 'utf-8').split('\n')

filterFullList()

async function filterFullList() {
    for (let i = 0; i < source.length; i += speed) {
        await filterIteration(i, speed)

        console.clear()
        console.log(`${counter} / ${i + speed}`)
    }
}

async function filterIteration(start, count) {
    let promises = []

    for (let i = start; i < start + count && i < source.length; i++)
        promises.push(checkItemAndAddToResult(domain + source[i]))

    await Promise.all(promises)

    fs.appendFile(pathToResult, resultIteration.join('\n') + '\n', function (err, result) {
        if (err) console.log('error', err)
        resultIteration = []
    })

    counter += resultIteration.length
}

async function checkItemAndAddToResult(url) {
    if (await checkItem(url))
        resultIteration.push(url)
}

async function checkItem(url) {
    let numOfCheckRow = -1
    let document = await getDOMByUrl(url)


    document.querySelectorAll("#tabs-1 > table > tbody > tr > th").forEach((item, key) => {
        if (item.textContent == 'Дата прекращения членства в СРО:')
            numOfCheckRow = key + 1
    })

    if (numOfCheckRow == -1)
        return false

    let date = document.querySelector(`#tabs-1 > table > tbody > tr:nth-child(${numOfCheckRow}) > td`).textContent

    return ['2015', '2016', '2017', '2018'].some(item => date.includes(item))
}
