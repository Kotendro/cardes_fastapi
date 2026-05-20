import { get_thumbnail_url, getDetail } from "/js/service/api.js"

export function initCardCatalog({ cardSection, store }) {
    const cardContainer = cardSection.querySelector("#cardContainer")
    const cardTemplate = cardSection.querySelector("#cardTemplate")
    const cardRow = cardSection.querySelector("#cardRow")

    let cardElements = {}
    let prevPage = null

    store.subscribe((state) => {
        if (prevPage != state.page) {
            prevPage = state.page
            fullRender(state)
        } else {
            partialRender(state)
        }
    })

    function fullRender(state) {
        const cards = Object.values(state.cardsById)
        
        // Очищаем всё
        cardRow.replaceChildren()
        const newCardElements = {}

        for (const card of cards) {
            const cardEl = createCardElement(card)
            cardRow.appendChild(cardEl)
            newCardElements[card.id] = cardEl
        }

        cardElements = newCardElements
    }

    function partialRender(state) {
        const cards = Object.values(state.cardsById)
        const newCardElements = {}

        for (const card of cards) {
            const existingEl = cardElements[card.id]

            if (existingEl) {
                // Элемент уже есть — обновляем только изменившееся
                updateCardElement(existingEl, card)
                newCardElements[card.id] = existingEl
            } else {
                // Новая карточка (если добавилась)
                const cardEl = createCardElement(card)
                cardRow.appendChild(cardEl)
                newCardElements[card.id] = cardEl
            }
        }

        // Удаляем элементы, которых больше нет в состоянии
        for (const id in cardElements) {
            if (!newCardElements[id]) {
                cardElements[id].remove()
            }
        }

        cardElements = newCardElements
    }

    function createCardElement(card) {
        const cardEl = cardTemplate.content.firstElementChild.cloneNode(true)
        cardEl.dataset.cardId = card.id

        const imgEl = cardEl.querySelector("img")
        imgEl.src = get_thumbnail_url({ card })
        imgEl.classList.toggle("img-grayscale", !card.completed)
        cardEl.querySelector("span").textContent = card.title

        return cardEl
    }

    function updateCardElement(cardEl, card) {
        const imgEl = cardEl.querySelector("img")
        
        // Меняем src только если URL реально изменился
        const newSrc = get_thumbnail_url({ card })
        if (imgEl.src !== newSrc) {
            imgEl.src = newSrc
        }
        
        // Обновляем grayscale (основное что меняется при toggle)
        imgEl.classList.toggle("img-grayscale", !card.completed)
        
        // Обновляем заголовок (на случай редактирования)
        cardEl.querySelector("span").textContent = card.title
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
        fullRender,
        partialRender,
    }
}