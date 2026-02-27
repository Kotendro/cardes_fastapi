export function initTagField({ dialog, form }) {
    const chipsContainerForm = dialog.querySelector("#chipsContainerForm")
    const tagEditor = dialog.querySelector("#tagFormEditor")
    const chipTemplate = dialog.querySelector("#chipTemplateForm")

    const tags = new Set()      

    tagEditor.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault()

            const value = tagEditor.value.trim().toLowerCase()
            if (validValue(value)) {
                tags.add(value)
                renderChip(value)
            }
            tagEditor.value = ""
        }
    })

    function validValue(value) {
        if (!value) {
            return false
        }
        if (tags.has(value)) {
            return false
        }
        return true
    }

    function renderChip(value) {
        const chip = chipTemplate.content.firstElementChild.cloneNode(true)

        chip.querySelector("span").textContent = value
        chip.querySelector("input").value = value

        chip.querySelector("button").addEventListener("click", () => {
            tags.delete(value)
            chip.remove()
        })

        chipsContainerForm.appendChild(chip)
    }

    
    function reset(tags_input = []) {
        tags.clear()
        chipsContainerForm.replaceChildren()

        for (const tag of tags_input) {
            tags.add(tag)
            renderChip(tag)
        }
    }

    return { reset }
}
