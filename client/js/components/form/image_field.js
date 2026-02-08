const form = document.querySelector("#cardForm");
const imageInput = document.querySelector("#image")
const previewImage = document.querySelector("#previewImage")
const previewPlaceholder = document.querySelector("#previewPlaceholder")
const imageError = document.querySelector("#imageError")

const fileTypes = ["image/jpeg", "image/png"]
const REQUIRED_RATIO = { width: 3, height: 4 }

form.addEventListener("submit", (e) => {
    e.preventDefault()
    if (!imageInput.validity.valid) {
        if (imageInput.validity.valueMissing) {
            showError("Required field.")
        }
    }
})

imageInput.addEventListener("change", async () => {
    const file = imageInput.files[0]
    if (!file) return

    try {
        const ok = await validateImage(file)
        if (!ok) return

        if (imageInput.files[0] !== file) return

        setPreview(file)
        showError("")
    } catch (e) {
        invalidateImage("Failed to read image")
    }
})

async function validateImage(file) {
    if (!fileTypes.includes(file.type)) {
        invalidateImage("Only .png/.jpg allowed")
        return false
    }

    const { width, height } = await getImageSize(file)
    const okRatio =
        width * REQUIRED_RATIO.height === height * REQUIRED_RATIO.width

    if (!okRatio) {
        invalidateImage(`Image must be ${REQUIRED_RATIO.width}:${REQUIRED_RATIO.height}`)
        return false
    }

    return true
}

function invalidateImage(msg) {
    showError(msg)
    clearPreview()
    imageInput.value = ""
}

function showError(msg) {
    imageError.textContent = msg
}

function getImageSize(file) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const objectUrl = URL.createObjectURL(file)

        img.onload = () => {
            URL.revokeObjectURL(objectUrl)
            resolve({ width: img.naturalWidth, height: img.naturalHeight })
        }

        img.onerror = (e) => {
            URL.revokeObjectURL(objectUrl)
            reject(e)
        }

        img.src = objectUrl
    })
}

function setPreview(file) {
    clearPreview()

    const objectUrl = URL.createObjectURL(file)
    previewImage.src = objectUrl
    previewImage.dataset.objectUrl = objectUrl
}

function clearPreview() {
    const oldUrl = previewImage.dataset.objectUrl
    if (oldUrl) {
        URL.revokeObjectURL(oldUrl)
        delete previewImage.dataset.objectUrl
    }

    previewImage.removeAttribute("src")
}
