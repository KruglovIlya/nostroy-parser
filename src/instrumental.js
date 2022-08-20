import fetch from 'node-fetch'
import https from 'https'
import { JSDOM } from 'jsdom'

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
})


export async function getDOMByUrl(url) {
    let response = await fetch(url, { agent: httpsAgent })

    let { document } = (new JSDOM(await response.text())).window

    return document
}
