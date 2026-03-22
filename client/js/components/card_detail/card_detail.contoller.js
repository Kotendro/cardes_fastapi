import {
    detail_reset,
    difficulty_render,
    tags_render,
    completed_render,
    image_render,
} from "/js/components/card_detail/card_detail.render.js"
import { patchCard } from "/js/service/api.js"
import { selectCurrentDetail } from "/js/store/state.utils.js"
import { upsertCard } from "/js/store/store.utils.js"

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
        const card = selectCurrentDetail(state)

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

        const prev = selectCurrentDetail(state0)
        if (!prev) return

        const nextCompleted = !prev.completed

        // 1) optimistic update (и shortById, и detailById обновятся через upsertCard)
        store.setState(state => {
            const cur = state.detailById[id]
            if (!cur) return state
            return upsertCard(state, { ...cur, completed: nextCompleted })
        })

        const formData = new FormData()
        formData.set("completed", nextCompleted ? "true" : "false")

        try {
            // 2) сервер прислал "истину" — кладём её в byId
            const fresh = await patchCard(id, formData)
            store.setState(state => upsertCard(state, fresh))
        } catch (err) {
            // 3) ошибка — откатываем обратно prev
            store.setState(state => upsertCard(state, prev))
        }
    })

    return {
        open,
        close,
        render,
    }
}