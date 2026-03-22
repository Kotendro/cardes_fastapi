import { getPage, getDetail } from "/js/service/api.js"
import { initCardForm } from "/js/components/card_form/card_form.controller.js"
import { initCardDetail } from "/js/components/card_detail/card_detail.contoller.js"
import { initCardCatalog } from "/js/cards/cards.controller.js"
import { createStore } from "/js/store/store.js"
import { normalizeById } from "/js/service/api.utils.js"

const cardFormDialog = document.querySelector("#cardFormDialog")
const cardDetailDialog = document.querySelector("#cardDetailDialog")
const cardSection = document.querySelector("#cardSection")
const cardForm = document.querySelector("#cardForm")
const addCardBtn = document.querySelector("#addCardBtn")


const store = createStore({
    screen: "list",
    formMode: "create",

    currentId: null,
    shortById: {},
    detailById: {},
})

const cardFormApi = initCardForm({
    dialog: cardFormDialog,
    form: cardForm,
    store: store
})

const cardDetailApi =  initCardDetail({
    dialog: cardDetailDialog,
    store: store
})

const cardCatalogApi = initCardCatalog({
    cardSection: cardSection,
    store: store,
})


const { items, total } = await getPage({
    page: 1,
    limit: 20,
})

const normalize = normalizeById(items)

store.setState({ shortById: normalize })

console.log(addCardBtn)
addCardBtn.addEventListener("click", () => {
    store.setState({ screen:"form", formMode:"create" })
})