import { initTitleField } from "/js/components/card_form/fields/title.field.js"
import { initImageField } from "/js/components/card_form/fields/image.field.js"
import { initTagField } from "/js/components/card_form/fields/tag.field.js"
import { addCard, patchCard, get_big_image_url } from "/js/service/api.js"
import { buildPatch, buildPost, fillForm } from "/js/components/card_form/card_form.mapper.js"

export function initCardForm({ dialog, form }) {
    const titleField = initTitleField({ dialog, form })
    const imageField = initImageField({ dialog, form })
    const tagField = initTagField({ dialog, form })

    let mode = "create"
    let editingCardDetailed = null

    form.addEventListener("submit", async (e) => {
        e.preventDefault()

        const okTitle = titleField.validate()
        const okImage = await imageField.validate()

        if (!okTitle) return
        if (!okImage) return
        
        if (mode === "create") {
            const formData = buildPost({
                form,
            })
            const data = await addCard(formData)
            dialog.close()
            return
        }

        if (mode === "edit") {
            const formData = buildPatch({
                form,
                cardDetailed: editingCardDetailed,
            })

            const data = await patchCard(editingCardDetailed.id, formData)
            dialog.close()
            return
        }
    })

    function openCreate() {
        mode = "create"
        editingCardDetailed = null

        form.reset()
        imageField.reset({ _mode: "create", DefaultUrl: null })
        tagField.reset()
        titleField.reset()
        dialog.showModal()
    }

    function openEdit(cardDetailed) {
        mode = "edit"
        editingCardDetailed = cardDetailed

        fillForm({ form, cardDetailed })
        const url = get_big_image_url({card:editingCardDetailed, cache:false})
        imageField.reset({ _mode: "edit", DefaultUrl: url })
        tagField.reset(cardDetailed.tags)
        titleField.reset()
        

        dialog.showModal()
    }

    return {
        openCreate,
        openEdit
    }
}