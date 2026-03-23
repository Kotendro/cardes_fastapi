import { get_thumbnail_url, getDetail, getPage } from "/js/service/api.js"

export function initCardCatalog({ cardSection, store }) {
    const cardContainer = cardSection.querySelector("#cardContainer")
    const cardTemplate = cardSection.querySelector("#cardTemplate")
    const cardRow = cardSection.querySelector("#cardRow")

    store.subscribe((state) => {
        cardRow.replaceChildren()
        render(state)
    })

    function render(state) {
        const cards = Object.values(state.cardsById)

        for (const card of cards) {
            const cardEl = cardTemplate.content.firstElementChild.cloneNode(true)
            
            cardEl.dataset.cardId = card.id

            const imgEl = cardEl.querySelector("img")
            imgEl.src = get_thumbnail_url({ card })
            imgEl.classList.toggle("img-grayscale", !card.completed)
            cardEl.querySelector("span").textContent = card.title

            cardRow.appendChild(cardEl)
        }
    }

    cardRow.addEventListener("click", async (e) => {
        const cardEl = e.target.closest("[data-card-id]")
        if (!cardEl) return

        const id = cardEl.dataset.cardId
        const detail = await getDetail(id)

        store.setState({
            screen: "detail",
            currentId: detail.id,
        })
    })

    return {
        render
    }
}