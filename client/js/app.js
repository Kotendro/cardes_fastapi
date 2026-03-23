import { getPage, getDetail } from "/js/service/api.js"
import { initCardForm } from "/js/components/card_form/card_form.controller.js"
import { initCardDetail } from "/js/components/card_detail/card_detail.contoller.js"
import { initCardCatalog } from "/js/cards/cards.controller.js"
import { initPagination } from "/js/cards/pagination.js"
import { createStore } from "/js/store/store.js"
import { normalizeById } from "/js/service/api.utils.js"

const cardFormDialog = document.querySelector("#cardFormDialog")
const cardDetailDialog = document.querySelector("#cardDetailDialog")
const cardSection = document.querySelector("#cardSection")
const cardForm = document.querySelector("#cardForm")
const addCardBtn = document.querySelector("#addCardBtn")
const paginationNav = document.querySelector("#paginationNav")


const store = createStore({
    screen: "list",
    formMode: "create",

    currentId: null,
    cardsById: {},

    page: 0,
    limit: 4,
    total: null
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

const PaginationApi = initPagination({
    paginationNav: paginationNav,
    store: store,
})


const {page, limit} = store.getState()

const { items, total } = await getPage({
    page: page,
    limit: limit,
})
const normalize = normalizeById(items)
store.setState({
    cardsById: normalize,
    total: total
})

addCardBtn.addEventListener("click", () => {
    store.setState({ screen:"form", formMode:"create" })
})