export function update_buttons({ mode, submitBtnForm, backBtnForm, deleteBtnForm }) {
    if (mode === "create") {
        backBtnForm.classList.add("d-none")
        deleteBtnForm.classList.add("d-none")
        submitBtnForm.textContent = "Add"
    } else if (mode === "edit") {
        backBtnForm.classList.remove("d-none")
        deleteBtnForm.classList.remove("d-none")
        submitBtnForm.textContent = "Save"
    }
}

export function form_reset({ form, cardDetailed }) {
    const titleInput = form.querySelector("#titleFormInput")
    const descriptionInput = form.querySelector("#descriptionFormInput")
    const difficultyInput = form.querySelector("#difficultyFormInput")
    const completedInput = form.querySelector("#completedFormInput")


}
