export interface CardIface {
    id: string
    title: string
    difficulty: number
    completed: boolean
    tag_names: string[]
    description: string
    image?: File // Удобство для отправки изменений в API
    image_url?: string
    thumb_url?: string
    updated_at?: string // Для обхода браузерного кэша
}

export enum DialogMode {
    Edit = "EDIT",
    Display = "DISPLAY",
    New = "NEW",
}