import fs from 'fs'
import { ListPage } from "./ListPage.js"

export async function startParsingInAllPages(speed, endPageNum) {
    let totalCount = 0

    for (let i = 1; i < endPageNum; i += speed)
        console.log(totalCount += await parsingIteration(i, i + speed))
}

export async function textParsing(pageNum) {
    parsingIteration(pageNum, pageNum + 1)
}

async function parsingIteration(start, end) {
    let links = []
    let promises = []

    for (let i = start; i < end; i++) {
        let listPage = new ListPage(i)

        promises.push(listPage.initDocument().then(() => {
            links.push(...listPage.getLinksInListPage())
        }))
    }

    await Promise.all(promises)

    fs.appendFile('result.txt', links.join('\n') + '\n', function (err, result) {
        if (err) console.log('error', err)
    })

    return links.length
}