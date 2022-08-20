import { getDOMByUrl } from './instrumental.js'

export class ListPage {
    document
    pageNum

    constructor(pageNum = 1) {
        this.pageNum = pageNum
    }

    _getPageLink(pageNum) {
        return `https://reestr.nostroy.ru/reestr?m_fulldescription=&m_shortdescription=&m_inn=&m_ogrnip=&bms_id=2&bmt_id=&u_registrationnumber=&sort=m.id&direction=asc&page=${pageNum}`
    }

    async initDocument() {
        this.document = await getDOMByUrl(this._getPageLink(this.pageNum))
    }

    getLinksInListPage() {
        let links = []

        this.document.querySelectorAll("#members > table > tbody > tr").forEach((item) => {
            links.push(item.getAttribute("rel"))
        })

        return links
    }

    setPageNum(pageNum) {
        this.pageNum = pageNum
    }
}