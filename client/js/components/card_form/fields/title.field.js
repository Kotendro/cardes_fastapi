export function initTitleField({ dialog, form }) {
    const titleInput = dialog.querySelector("#titleFormInput")
    const titleError = dialog.querySelector("#titleFormError")

    titleInput.addEventListener("input", () => {
        titleError.textContent = ""
    })

    function validate() {
        if (!titleInput.validity.valid) {
            showError()
            return false
        }
        return true
    }

    function showError() {
        if (titleInput.validity.valueMissing) {
            titleError.textContent = "Required field."
        }
    }

    return {
        validate,
        reset: () => {
            titleError.textContent = ""
        }
    }
}