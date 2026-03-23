import { getPage } from "/js/service/api.js"
import { normalizeById } from "/js/service/api.utils.js"

export function initPagination({ paginationNav, store }) {
    const paginationList = paginationNav.querySelector("ul")
    const listObjectTemplate = paginationNav.querySelector("template")

    let prev_page = null
    let prev_limit = null
    let prev_page_total = null

    store.subscribe((state) => {
        if (
            prev_page !== state.page ||
            prev_limit !== state.limit ||
            prev_page_total !== Math.ceil(state.total / state.limit)
        ) {
            prev_page = state.page
            prev_limit = state.limit
            prev_page_total = Math.ceil(state.total / state.limit)
            render(state)
        }
    })

    function render(state) {
        const pageTotal = state.limit > 0 ? Math.ceil(state.total / state.limit) : 0

        paginationList.replaceChildren()

        if (pageTotal === 0) return

        const createPageItem = ({ text, page = null, active = false }) => {
            const liEl = listObjectTemplate.content.firstElementChild.cloneNode(true)
            const linkEl = liEl.querySelector("a")

            linkEl.textContent = text

            if (active) {
                liEl.classList.add("active")
                linkEl.setAttribute("aria-current", "page")
            }

            if (page !== null) {
                liEl.dataset.page = page
                liEl.dataset.limit = state.limit
            }

            return liEl
        }

        if (Number(state.page) > 0) {
            paginationList.appendChild(
                createPageItem({ text: "1", page: 0 })
            )

            paginationList.appendChild(
                createPageItem({ text: "←", page: Number(state.page) - 1 })
            )
        }

        paginationList.appendChild(
            createPageItem({
                text: String(Number(state.page) + 1),
                active: true,
            })
        )

        if (Number(state.page) < pageTotal - 1) {
            paginationList.appendChild(
                createPageItem({ text: "→", page: Number(state.page) + 1 })
            )

            paginationList.appendChild(
                createPageItem({
                    text: String(pageTotal),
                    page: pageTotal - 1,
                })
            )
        }
    }

    paginationList.addEventListener("click", async (e) => {
        const liEl = e.target.closest("[data-page]")
        if (!liEl) return

        const page = liEl.dataset.page
        const limit = liEl.dataset.limit

        const { items, total } = await getPage({
            page: page,
            limit: limit,
        })
        const normalize = normalizeById(items)

        store.setState({
            screen: "list",
            page: page,
            total: total,
            cardsById: normalize,
        })
        console.log(page, limit)
    })

    return {
        render
    }
}