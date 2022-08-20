import { ListPage } from "./ListPage.js"

export async function startParsingInAllPages() {
    let links = []
    let promises = []

    for (let i = 1; i < 10; i++) {
        let listPage = new ListPage(i)

        promises.push(listPage.initDocument().then(() => {
            links.push(...listPage.getLinksInListPage())
        }))
    }

    await Promise.all(promises);

    console.log(links);
}