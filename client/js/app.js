import { getDetail } from "/js/service/api.js"
import { initCardForm } from "/js/components/card_form/card_form.controller.js"

const cardFormDialog = document.querySelector("#cardFormDialog")
const cardForm = document.querySelector("#cardForm")
const addCardBtn = document.querySelector("#addCardBtn")
const editCardBtn = document.querySelector("#editCardBtn")

const cardFormApi = initCardForm({
    dialog: cardFormDialog,
    form: cardForm,
})

const card = await getDetail("f8642195-8d20-4a2a-a6e2-8f437641891b")
console.log(card)

addCardBtn.addEventListener("click", () => {
    cardFormApi.openCreate()
})

editCardBtn.addEventListener("click", () => {
    cardFormApi.openEdit(card)
})

