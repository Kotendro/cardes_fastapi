const inFlight = new Map()

function makeKey(url, method) {
    return `${method}:${url}`
}

export function get_big_image_url({card, cache=true}) {
    if (cache) { `http://127.0.0.1:8000/static/cards/${card.id}/big.jpg?v=${card.updated_at}` }
    return `http://127.0.0.1:8000/static/cards/${card.id}/big.jpg`
}

export function get_thumbnail_url({card, cache=true}) {
    if (cache) { `http://127.0.0.1:8000/static/cards/${card.id}/thumb.jpg?v=${card.updated_at}` }
    return `http://127.0.0.1:8000/static/cards/${card.id}/thumb.jpg`
}

export async function getPage({ page, limit } = {}) {
    
    const baseUrl = "http://127.0.0.1:8000/api/v1/cards"
    const urlObj = new URL(baseUrl)

    if (page !== undefined) urlObj.searchParams.set("page", page)
    if (limit !== undefined) urlObj.searchParams.set("limit", limit)
    

    const url = urlObj.toString()
    const method = "GET"
    const key = makeKey(url, method)

    if (inFlight.has(key)) {
        const promise = inFlight.get(key)
        return promise
    }

    const promise = (async () => {
        const response = await fetch(url, {
            method: method
        })
        return await response.json()
    })()

    inFlight.set(key, promise)

    try {
        return await promise
    } finally {
        inFlight.delete(key)
    }
}

export async function getDetail(id) {
    const url = `http://127.0.0.1:8000/api/v1/cards/${id}`
    const method = "GET"
    const key = makeKey(url, method)

    if (inFlight.has(key)) {
        const promise = inFlight.get(key)
        return promise
    }

    const promise = (async () => {
        const response = await fetch(url, {
            method: method
        })
        return await response.json()
    })()

    inFlight.set(key, promise)

    try {
        return await promise
    } finally {
        inFlight.delete(key)
    }
}

export async function addCard(formData) {
    const url = "http://127.0.0.1:8000/api/v1/cards"
    const method = "POST"

    const response = await fetch(url, {
        method: method,
        body: formData,
    })

    const result = await response.json()
    return result 
}

export async function patchCard(id, formData) {
    const url = `http://127.0.0.1:8000/api/v1/cards/${id}`
    const method = "PATCH"

    const response = await fetch(url, {
        method: method,
        body: formData,
    })

    const result = await response.json()
    return result 
}

export async function deleteCard(id) {
    const url = `http://127.0.0.1:8000/api/v1/cards/${id}`
    const method = "DELETE"
    const key = makeKey(url, method)

    if (inFlight.has(key)) {
        const promise = inFlight.get(key)
        return promise
    }

    const promise = (async () => {
        const response = await fetch(url, {
            method: method
        })
        return response.ok
    })()

    inFlight.set(key, promise)

    try {
        return await promise
    } finally {
        inFlight.delete(key)
    }
}
