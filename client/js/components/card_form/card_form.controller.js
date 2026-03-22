import { initTitleField } from "/js/components/card_form/fields/title.field.js"
import { initImageField } from "/js/components/card_form/fields/image.field.js"
import { initTagField } from "/js/components/card_form/fields/tag.field.js"
import { addCard, patchCard, get_big_image_url } from "/js/service/api.js"
import { buildPatch, buildPost, fillForm } from "/js/components/card_form/card_form.mapper.js"
import { update_buttons } from "/js/components/card_form/card_form.render.js"
import { selectCurrentDetail } from "/js/store/state.utils.js"
import { upsertCard } from "/js/store/store.utils.js"

export function initCardForm({ dialog, form, store }) {
    const titleField = initTitleField({ dialog, form })
    const imageField = initImageField({ dialog, form })
    const tagField = initTagField({ dialog, form })
    const backBtnForm = dialog.querySelector("#backBtnForm")
    const submitBtnForm = dialog.querySelector("#submitBtnForm")

    store.subscribe((state) => {
        if (state.screen !== "form") {
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
        if (state.formMode === "create") {
            renderCreate()
            return
        }

        if (state.formMode === "edit") {
            const currnetCard = selectCurrentDetail(state)
            renderEdit(currnetCard)
            return
        }
    }
    
    function renderCreate() {
        update_buttons({ mode: "create", submitBtnForm, backBtnForm })

        form.reset()
        imageField.reset({ _mode: "create", DefaultUrl: null })
        tagField.reset()
        titleField.reset()
    }

    function renderEdit(detail) {
        update_buttons({ mode: "edit", submitBtnForm, backBtnForm })

        fillForm({ form, cardDetailed: detail })
        const url = get_big_image_url({ card: detail, cache: false })
        imageField.reset({ _mode: "edit", DefaultUrl: url })
        tagField.reset(detail.tags)
        titleField.reset()
    }

    backBtnForm.addEventListener("click", () => {
        store.setState({screen: "detail" })
    })

    form.addEventListener("submit", async (e) => {
        e.preventDefault()

        const okTitle = titleField.validate()
        const okImage = await imageField.validate()

        if (!okTitle) return
        if (!okImage) return

        const state = store.getState()
        
        if (state.formMode === "create") {
            const formData = buildPost({ form })
            const created = await addCard(formData)

            store.setState(state => ({
            ...upsertCard(state, created),
            screen: "list",
            }))
            return
        }

        if (state.formMode === "edit") {
            const currentCard = selectCurrentDetail(state)

            const formData = buildPatch({ form, cardDetailed: currentCard })
            const patched = await patchCard(currentCard.id, formData)

            store.setState(state => ({
                ...upsertCard(state, patched),
                screen: "list",
            }))
            return
        }
    })

    return {
        open,
        close,
        render,
    }
}