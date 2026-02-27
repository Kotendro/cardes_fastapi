import {
    detail_reset,
    difficulty_render,
    tags_render,
    completed_render,
    image_render,
} from "/js/components/card_detail/card_detail.render.js"
import { patchCard } from "/js/service/api.js"

export function initCardDetail({ dialog, store }) {
    const titleDetail = dialog.querySelector("#titleDetail")
    const difficultyDetail = dialog.querySelector("#difficultyDetail")
    const chipsContainerDetail = dialog.querySelector("#chipsContainerDetail")
    const chipTemplateDetail = dialog.querySelector("#chipTemplateDetail")
    const descriptionDetail = dialog.querySelector("#descriptionDetail")
    const imageDetail = dialog.querySelector("#imageDetail")
    const editBtnDetail = dialog.querySelector("#editBtnDetail")
    const completeBtnDetail = dialog.querySelector("#completeBtnDetail")

    function open() {
        dialog.showModal()
    }

    function close() {
        dialog.close()
    }

    function render(state) {
        const card = state.currentCard

        detail_reset({
            difficultyDetail: difficultyDetail,
            chipsContainer: chipsContainerDetail,
            imageDetail: imageDetail,
        })
        titleDetail.textContent = card.title
        difficulty_render({
            difficulty: card.difficulty,
            difficultyDetail
        })
        tags_render({
            tags: card.tags,
            chipsContainer: chipsContainerDetail,
            chipTemplate: chipTemplateDetail,
        })
        descriptionDetail.textContent = card.description

        completed_render({
            completed: card.completed,
            imageDetail
        })
        image_render({
            card: card,
            imageDetail
        })
    }

    editBtnDetail.addEventListener("click", () => {
        store.setState({ screen: "form", formMode: "edit" })
    })

    completeBtnDetail.addEventListener("click", async () => {
        const s = store.getState()
        if (!s.currentCard) return

        const prev = s.currentCard
        const newCompleted = !prev.completed

        store.setState({
            currentCard: { ...prev, completed: newCompleted }
        })

        const formData = new FormData()
        formData.set("completed", newCompleted ? "true" : "false")

        try {
            const fresh = await patchCard(prev.id, formData)
            store.setState({ currentCard: fresh })
        } catch (err) {
            store.setState({ currentCard: prev })
        }
    })

    return {
        open,
        close,
        render,
    }
}