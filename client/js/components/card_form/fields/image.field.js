export function initImageField({ dialog, form }) {
  const imageInput = dialog.querySelector("#imageFormInput")
  const previewImage = dialog.querySelector("#imageFormPreview")
  const imageError = dialog.querySelector("#imageFormError")
  const placeholder = dialog.querySelector("#imageFormPlaceholder")

  const FILE_TYPES = ["image/jpeg", "image/png"]
  const REQUIRED_RATIO = { width: 3, height: 4 }

  let mode = "create"

  imageInput.addEventListener("change", async () => {
    const file = imageInput.files?.[0]

    if (!file) {
      restoreDefaultPreview()
      imageError.textContent = ""
      return
    }

    const { ok, msg } = await fileValidation(file)
    imageError.textContent = msg

    if (!ok) {
      imageInput.value = ""
      restoreDefaultPreview()
      return
    }

    setPreview(URL.createObjectURL(file))
  })

  function showPlaceholder() {
    previewImage.classList.add("d-none")
    placeholder.classList.remove("d-none")
  }

  function showImage() {
    previewImage.classList.remove("d-none")
    placeholder.classList.add("d-none")
  }

  function restoreDefaultPreview() {
    clearBlobPreview()
    const DefaultUrl = previewImage.dataset.DefaultUrl

    if (DefaultUrl) {
      previewImage.src = DefaultUrl
      showImage()
    } else {
      previewImage.removeAttribute("src")
      showPlaceholder()
    }
  }

  function setPreview(objectUrl) {
    clearBlobPreview()
    previewImage.src = objectUrl
    previewImage.dataset.objectUrl = objectUrl
    showImage()
  }

  function clearBlobPreview() {
    const oldUrl = previewImage.dataset.objectUrl
    if (oldUrl?.startsWith("blob:")) URL.revokeObjectURL(oldUrl)
    delete previewImage.dataset.objectUrl
  }

  async function validate() {
    const { ok, msg } = await submitValidation()
    imageError.textContent = msg
    return ok
  }

  async function submitValidation() {
    const file = imageInput.files?.[0]

    if (mode === "edit" && !file) return { ok: true, msg: "" }
    if (mode === "create" && !file) return { ok: false, msg: "Required field." }

    try {
      return await fileValidation(file)
    } catch {
      return { ok: false, msg: "Bad image file" }
    }
  }

  async function fileValidation(file) {
    if (!FILE_TYPES.includes(file.type)) return { ok: false, msg: "Only .png/.jpg allowed" }

    const { width, height } = await getImageSize(file)
    const okRatio = width * REQUIRED_RATIO.height === height * REQUIRED_RATIO.width
    if (!okRatio) return { ok: false, msg: `Image must be ${REQUIRED_RATIO.width}:${REQUIRED_RATIO.height}` }

    return { ok: true, msg: "" }
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

  function reset({ _mode, DefaultUrl }) {
    mode = _mode
    imageError.textContent = ""
    imageInput.value = ""

    clearBlobPreview()

    if (DefaultUrl) {
      previewImage.dataset.DefaultUrl = DefaultUrl
      previewImage.src = DefaultUrl
      showImage()
    } else {
      delete previewImage.dataset.DefaultUrl
      previewImage.removeAttribute("src")
      showPlaceholder()
    }
  }


  return { validate, reset }
}
