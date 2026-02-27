import { getDetail } from "/js/service/api.js"
import { initCardForm } from "/js/components/card_form/card_form.controller.js"
import { initCardDetail } from "/js/components/card_detail/card_detail.contoller.js"
import { createStore } from "/js/store.js"

const cardFormDialog = document.querySelector("#cardFormDialog")
const cardDetailDialog = document.querySelector("#cardDetailDialog")
const cardForm = document.querySelector("#cardForm")
const addCardBtn = document.querySelector("#addCardBtn")
const detailCardBtn = document.querySelector("#detailCardBtn")

const store = createStore({
    screen: "list",
    currentCard: null,
    formMode: "create"
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

store.subscribe((state) => {
    if (state.screen === "form") {
        cardDetailApi.close()
        cardFormApi.open()
        cardFormApi.render(state)
        return
    }

    if (state.screen === "detail") {
        cardFormApi.close()
        cardDetailApi.open()
        cardDetailApi.render(state)
        return
    }

    cardFormApi.close()
    cardDetailApi.close()
})


const card = await getDetail("f8642195-8d20-4a2a-a6e2-8f437641891b")
store.setState({currentCard: card})
console.log(card)

addCardBtn.addEventListener("click", () => {
    store.setState({ screen:"form", formMode:"create" })
})

detailCardBtn.addEventListener("click", () => {
    store.setState({ screen:"detail" })
})