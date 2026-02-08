const addTagButton = document.querySelector("#addTag")
const chipsContainer = document.querySelector("#chips")
const tagEditor = document.querySelector("#tagEditor")
const tagEditorError  = document.querySelector("#tagEditorError")

const tags = new Set()

tagEditor.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault()

        const value = tagEditor.value.trim()
        const lower = value.toLowerCase()

        if (!validValue(value)) {
            tagEditor.focus()
            return
        }

        tags.add(lower)
        renderChip(value)

        addTagButton.hidden = false
        tagEditor.hidden = true
        showError("")
        addTagButton.focus()
    }

    if (e.key === "Escape") {
        e.preventDefault()
        addTagButton.hidden = false
        tagEditor.hidden = true
        showError("")
        addTagButton.focus()
    }
})

tagEditor.addEventListener("blur", () => {
    addTagButton.hidden = false
    tagEditor.hidden = true
    showError("")
})

tagEditor.addEventListener("input", () => {
    if (tagEditorError.textContent) showError("")
})

addTagButton.addEventListener("click", () => {
    addTagButton.hidden = true
    tagEditor.value = ""
    tagEditor.hidden = false
    tagEditor.focus()
})

function validValue(value) {
    const lower = value.toLowerCase()

    if (!lower) {
        showError("Empty field.")
        return false
    } 
    if (tags.has(lower)) {
        showError("Tag already exists")
        return false
    }
    
    showError("")
    return true
}

function showError(msg) {
    tagEditorError.textContent = msg
}

function renderChip(value) {
    const lower = value.toLowerCase()

    const chip = document.createElement("div")
    chip.className = "chip"

    const text = document.createElement("span")
    text.textContent = value

    const tagInput = document.createElement("input")
    tagInput.type = "hidden"
    tagInput.name = "tag_names"
    tagInput.value = value

    const remove = document.createElement("button")
    remove.type = "button"
    remove.textContent = "del"
    remove.addEventListener("click", () => {
        tags.delete(lower)
        chip.remove()
    })

    chip.append(text, tagInput, remove)
    chipsContainer.appendChild(chip)
}
