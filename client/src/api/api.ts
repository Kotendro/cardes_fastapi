import type { CardIface } from '@/types'
import axios from 'axios'

export function preload_image_urls(cards: CardIface[]){
    for (const card of cards) {
        if (card.image_url) {
            const img = new Image()
            img.src = card.image_url
        }
    }
}

export function preload_image_url(card: CardIface){
    if (card.image_url) {
        const img = new Image()
        img.src = card.image_url
        console.log(`cached ${card.image_url}`)
    }
}

export function image_url(card: CardIface, cache: boolean = true) {
    if (!cache) {
        return `http://127.0.0.1:8000/static/${card.id}/big.jpg?u=${card.updated_at}`
    }
    return `http://127.0.0.1:8000/static/${card.id}/big.jpg`
}

export function thumb_url(card: CardIface, cache: boolean = true) {
    if (!cache) {
        return `http://127.0.0.1:8000/static/${card.id}/thumb.jpg?u=${card.updated_at}`
    }
    return `http://127.0.0.1:8000/static/${card.id}/thumb.jpg`
}

export async function get_card_list(page: number, limit: number) {
    const { data } = await axios.get("http://127.0.0.1:8000/api/v1/cards", {
        params: {
            page,
            limit,
        }
    })
    return data
}

export async function get_card(id: string) {
    const { data } = await axios.get(`http://127.0.0.1:8000/api/v1/cards/${id}`)
    return data
}

export async function patch_card(id: string, updatedFields: Partial<CardIface>) {
    const formData = new FormData()

    for (const [key, value] of Object.entries(updatedFields)) {
        if (value === undefined || value === null) continue

        if (value instanceof File) {
            formData.append(key, value)
        } else if (Array.isArray(value)) {
            value.forEach(item => formData.append(key, String(item)))
        } else {
            formData.append(key, String(value));
        }
    }

    const respons = await axios.patch(`http://127.0.0.1:8000/api/v1/cards/${id}`, formData)
    return respons
}
