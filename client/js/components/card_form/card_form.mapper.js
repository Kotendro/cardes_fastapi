export function fillForm({ form, cardDetailed }) {
    const titleInput = form.querySelector("#titleFormInput")
    const descriptionInput = form.querySelector("#descriptionFormInput")
    const difficultyInput = form.querySelector("#difficultyFormInput")
    const completedInput = form.querySelector("#completedFormInput")

    titleInput.value = cardDetailed.title
    descriptionInput.value = cardDetailed.description
    difficultyInput.value = cardDetailed.difficulty
    completedInput.checked = Boolean(cardDetailed.completed)
}

export function buildPost({ form }) {
    const fd = new FormData(form)

    if (!fd.has("completed")) {
        fd.set("completed", "false")
    }

    return fd
}


export function buildPatch({ form, cardDetailed }) {
    const rawFd = new FormData(form)
    const patchFd = new FormData()

    const title = rawFd.get("title")
    if (title !== cardDetailed.title) {
        patchFd.set("title", title)
    }

    const description = rawFd.get("description")
    if (description !== cardDetailed.description) {
        patchFd.set("description", description)
    }

    const difficulty = rawFd.get("difficulty")
    if (difficulty !== cardDetailed.difficulty) {
        patchFd.set("difficulty", difficulty)
    }

    const completed = rawFd.has("completed")
    if (completed !== !!cardDetailed.completed) {
        patchFd.set("completed", completed ? "true" : "false")
    }

    // tags
    const newTags = rawFd.getAll("tag_names")
    const oldTags = cardDetailed.tag_names || []

    const same =
        newTags.length === oldTags.length &&
        newTags.every(tag => oldTags.includes(tag))

    if (!same) {
        newTags.forEach(tag => {
            patchFd.append("tag_names", tag)
        })
    }

    const file = rawFd.get("image")
    if (file instanceof File && file.size > 0) {
        patchFd.set("image", file)
    }

    return patchFd
}
