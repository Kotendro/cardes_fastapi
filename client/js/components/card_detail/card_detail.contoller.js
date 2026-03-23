import {
    detail_reset,
    difficulty_render,
    tags_render,
    completed_render,
    image_render,
} from "/js/components/card_detail/card_detail.render.js"
import { patchCard, getPage } from "/js/service/api.js"
import { selectCurrentCard } from "/js/store/state.utils.js"
import { normalizeById } from "/js/service/api.utils.js"


export function initCardDetail({ dialog, store }) {
    const titleDetail = dialog.querySelector("#titleDetail")
    const difficultyDetail = dialog.querySelector("#difficultyDetail")
    const chipsContainerDetail = dialog.querySelector("#chipsContainerDetail")
    const chipTemplateDetail = dialog.querySelector("#chipTemplateDetail")
    const descriptionDetail = dialog.querySelector("#descriptionDetail")
    const imageDetail = dialog.querySelector("#imageDetail")
    const editBtnDetail = dialog.querySelector("#editBtnDetail")
    const completeBtnDetail = dialog.querySelector("#completeBtnDetail")

    store.subscribe((state) => {
        if (state.screen !== "detail") {
            close()
            return
        }
        open()
        render(state)
    })

    function open() {
        if (!dialog.open) dialog.showModal()
    }

    function close() {
        if (dialog.open) dialog.close()
    }

    function render(state) {
        const card = selectCurrentCard(state)

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
        const state0 = store.getState()
        const id = state0.currentId
        if (!id) return

        const prev = selectCurrentCard(state0)
        if (!prev) return

        const nextCompleted = !prev.completed

        const formData = new FormData()
        formData.set("completed", nextCompleted ? "true" : "false")

        try {
            await patchCard(id, formData)

            const state1 = store.getState()
            const { items, total } = await getPage({
                page: state1.page,
                limit: state1.limit,
            })
            const normalize = normalizeById(items)

            store.setState({
                ...state1,
                cardsById: normalize,
                total: total,
            })
        } catch (err) {
            console.error(err)
        }
    })

    return {
        open,
        close,
        render,
    }
}