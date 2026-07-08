import type { CardAdd, CardIface, CardPatch, CardOut } from '@/types'
import axios from 'axios'

export function preloadImageURLs(cards: CardIface[]){
    for (const card of cards) {
        preloadImageURL(card)
    }
}

export function preloadImageURL(card: CardIface){
    if (card.image_url) {
        const img = new Image()
        img.src = card.image_url
        img.decode()
    }
}

export function imageURL(card: CardIface, cache: boolean = true) {
    if (!cache) {
        return `http://127.0.0.1:8000/static/${card.id}/big.jpg?d=${Date.now()}`
    }
    return `http://127.0.0.1:8000/static/${card.id}/big.jpg`
}

export function thumbURL(card: CardIface, cache: boolean = true) {
    if (!cache) {
        return `http://127.0.0.1:8000/static/${card.id}/thumb.jpg?d=${Date.now()}`
    }
    return `http://127.0.0.1:8000/static/${card.id}/thumb.jpg`
}

export async function getCardListRequest(page: number, limit: number) {
    const { data } = await axios.get("http://127.0.0.1:8000/api/v2/cards", {
        params: {
            page,
            limit,
        }
    })
    return data
}

export async function uploadImageRequest(id: string, image: File) {
    const formData = new FormData();
    formData.append('image', image);
    console.log(id)
    const response = await axios.post(
        `http://127.0.0.1:8000/api/v2/cards/${id}/upload_image`, formData)
    return response
}

export async function getCardRequest(id: string): Promise<CardOut> {
    const { data } = await axios.get(`http://127.0.0.1:8000/api/v2/cards/${id}`)
    return data
}

export async function addCardRequest(data: CardAdd) {
    const response = await axios.post(`http://127.0.0.1:8000/api/v2/cards`, data)
    return response    
}

export async function patchCardRequest(id: string, data: CardPatch) {
    const response = await axios.patch(`http://127.0.0.1:8000/api/v2/cards/${id}`, data)
    return response
}

export async function deleteCardRequest(id: string) {
    const response = await axios.delete(`http://127.0.0.1:8000/api/v2/cards/${id}`)
    return response
}