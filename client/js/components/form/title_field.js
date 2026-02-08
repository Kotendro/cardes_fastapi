const form = document.querySelector("#cardForm");
const titleInput = document.querySelector("#title")
const titleError = document.querySelector("#titleError")

titleInput.addEventListener("input", (e) => {
    titleError.textContent = ""
})

form.addEventListener("submit", (e) => {
  if (!titleInput.validity.valid) {
    showError()
    e.preventDefault()
  }
})

function showError() {
  if (titleInput.validity.valueMissing) {
    titleError.textContent = "Required field."
  } 
}