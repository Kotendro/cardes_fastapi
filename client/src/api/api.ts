import type { CardAdd, CardIface, CardPatch, CardOut } from '@/types'
import axios from 'axios'

export function preload_image_urls(cards: CardIface[]){
    for (const card of cards) {
        preload_image_url(card)
    }
}

export function preload_image_url(card: CardIface){
    if (card.image_url) {
        const img = new Image()
        img.src = card.image_url
        img.decode()
    }
}

export function image_url(card: CardIface, cache: boolean = true) {
    if (!cache) {
        return `http://127.0.0.1:8000/static/${card.id}/big.jpg?d=${Date.now()}`
    }
    return `http://127.0.0.1:8000/static/${card.id}/big.jpg`
}

export function thumb_url(card: CardIface, cache: boolean = true) {
    if (!cache) {
        return `http://127.0.0.1:8000/static/${card.id}/thumb.jpg?d=${Date.now()}`
    }
    return `http://127.0.0.1:8000/static/${card.id}/thumb.jpg`
}

export async function get_card_list(page: number, limit: number) {
    const { data } = await axios.get("http://127.0.0.1:8000/api/v2/cards", {
        params: {
            page,
            limit,
        }
    })
    return data
}

export async function upload_image(id: string, image: File) {
    const formData = new FormData();
    formData.append('image', image);
    console.log(id)
    const response = await axios.post(
        `http://127.0.0.1:8000/api/v2/cards/${id}/upload_image`, formData)
    return response
}

export async function get_card(id: string): Promise<CardOut> {
    const { data } = await axios.get(`http://127.0.0.1:8000/api/v2/cards/${id}`)
    return data
}

export async function add_card(data: CardAdd) {
    const response = await axios.post(`http://127.0.0.1:8000/api/v2/cards`, data)
    return response    
}

export async function patch_card(id: string, data: CardPatch) {
    const response = await axios.patch(`http://127.0.0.1:8000/api/v2/cards/${id}`, data)
    return response
}

export async function delete_card(id: string) {
    const response = await axios.delete(`http://127.0.0.1:8000/api/v2/cards/${id}`)
    return response
}