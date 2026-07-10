export interface CardIface {
    id: string
    title: string
    difficulty: number
    completed: boolean
    tags: string[]
    description: string
    image?: File // Удобство для отправки изменений в API
    image_url?: string
    thumb_url?: string
    updated_at?: string // Для обхода браузерного кэша
}

export interface CardOut {
    id: string
    title: string
    description: string
    difficulty: number
    completed: boolean
    created_at: string
    updated_at: string
    tags: string[]
}

export interface CardPatch {
    title?: string
    description?: string
    difficulty?: number
    completed?: boolean
    tags?: string[]
}

export interface CardAdd {
    title: string
    description: string
    difficulty: number
    completed: boolean
    tags: string[]
}

export enum DialogMode {
    Edit = "EDIT",
    Display = "DISPLAY",
    New = "NEW",
}