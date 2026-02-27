import { initTitleField } from "/js/components/card_form/fields/title.field.js"
import { initImageField } from "/js/components/card_form/fields/image.field.js"
import { initTagField } from "/js/components/card_form/fields/tag.field.js"
import { addCard, patchCard, get_big_image_url } from "/js/service/api.js"
import { buildPatch, buildPost, fillForm } from "/js/components/card_form/card_form.mapper.js"
import { update_buttons } from "/js/components/card_form/card_form.render.js"

export function initCardForm({ dialog, form, store }) {
    const titleField = initTitleField({ dialog, form })
    const imageField = initImageField({ dialog, form })
    const tagField = initTagField({ dialog, form })
    const backBtnForm = dialog.querySelector("#backBtnForm")
    const submitBtnForm = dialog.querySelector("#submitBtnForm")

    function open() {
        dialog.showModal()
    }

    function close() {
        dialog.close()
    }

    function renderCreate() {
        update_buttons({ mode: "create", submitBtnForm, backBtnForm })

        form.reset()
        imageField.reset({ _mode: "create", DefaultUrl: null })
        tagField.reset()
        titleField.reset()
    }

    function renderEdit(card) {
        update_buttons({ mode: "edit", submitBtnForm, backBtnForm })

        fillForm({ form, cardDetailed: card })
        const url = get_big_image_url({ card, cache: false })
        imageField.reset({ _mode: "edit", DefaultUrl: url })
        tagField.reset(card.tags)
        titleField.reset()
    }

    function render(state) {
        if (state.formMode === "create") {
            renderCreate()
            return
        }

        if (state.formMode === "edit") {
            renderEdit(state.currentCard)
            return
        }
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

        const { formMode, currentCard } = store.getState()
        
        if (formMode === "create") {
            const formData = buildPost({ form })
            const data = await addCard(formData)

            store.setState({
                screen: "list",
                currentCard: data,
            })
            return
        }

        if (formMode === "edit") {
            const formData = buildPatch({ form, cardDetailed: currentCard })
            const data = await patchCard(currentCard.id, formData)

            store.setState({
                screen: "list",
                currentCard: data,
            })
            return
        }
    })

    return {
        open,
        close,
        render,
    }
}