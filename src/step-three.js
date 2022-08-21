import { getDOMByUrl } from './instrumental.js'
import fs from 'fs'

const pathToLinkList = 'result-two.txt'
const pathToResult = 'additional-result.csv'
const speed = 50

var source = fs.readFileSync(pathToLinkList, 'utf-8').split('\n')
var result = []
var counter = 0

creatCSVFromLinks(source)

async function creatCSVFromLinks(links) {
    for (let i = 0; i < links.length; i += speed)
        await exportIteration(i, speed)
}

async function exportIteration(start, count) {
    let promises = []

    for (let i = start; i < start + count && i < source.length; i++)
        promises.push(readDateFromSite(source[i]))

    await Promise.all(promises)

    console.clear()
    console.log(`${counter += result.length} / ${source.length}`)
    result.forEach(row => outputDateToCSVFile(row))
    result = []
}

async function readDateFromSite(link) {
    let tableRow = []
    if (link == '')
        return

    tableRow.push((await getDOMByUrl(link)).querySelector("#tabs-1 > table > tbody > tr:nth-child(5) > td").textContent)

    let document = await getDOMByUrl(link + '/compensation')

    document.querySelectorAll("#block-compensation-member-content > div > div").forEach(node => {
        tableRow.push(node.textContent)
        tableRow.push(node.querySelector('u').textContent)
    });

    result.push(tableRow)
}

function outputDateToCSVFile(arr) {
    let res = []
    arr.forEach(cell => res.push(cell.trim()))
    fs.appendFileSync(pathToResult, res.join(';').replaceAll('\n', ' ') + '\n', function (err, result) {
        if (err) console.log('error', err)
    })

}