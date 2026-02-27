export function update_buttons({ mode, submitBtnForm, backBtnForm }) {
    if (mode === "create") {
        backBtnForm.classList.add("d-none")
        submitBtnForm.textContent = "Add"
    } else if (mode === "edit") {
        backBtnForm.classList.remove("d-none")
        submitBtnForm.textContent = "Save"
    }
}