import { get_big_image_url } from "/js/service/api.js"

const difficultyColors = {
    hard: "text-danger",
    medium: "text-warning",
    easy: "text-success"
}

export function detail_reset({ difficultyDetail, chipsContainer, imageDetail }) {
    const difficultyColorClasses = Object.values(difficultyColors)

    if (difficultyDetail) {
        difficultyDetail.textContent = ""
        difficultyDetail.classList.remove(...difficultyColorClasses)
    }

    if (chipsContainer) {
        chipsContainer.replaceChildren()
    }

    if (imageDetail) {
        imageDetail.removeAttribute("src")
        imageDetail.classList.remove("img-grayscale")
        imageDetail.style.removeProperty("filter")
    }
}

export function difficulty_render({ difficulty, difficultyDetail }) {
    difficultyDetail.textContent = difficulty

    const cls = difficultyColors[difficulty]
    if (cls) difficultyDetail.classList.add(cls)
}

export function tags_render({ tags, chipsContainer, chipTemplate }) {
    for (const tag of tags) {
        const chip = chipTemplate.content.firstElementChild.cloneNode(true)
        chip.querySelector("span").textContent = tag
        chipsContainer.appendChild(chip)
    }
}

export function completed_render({ completed, imageDetail }) {
    imageDetail.classList.toggle("img-grayscale", !completed)
}


export function image_render({ card, imageDetail }) {
    const url = get_big_image_url({ card: card, cache: true })
    imageDetail.src = url
}