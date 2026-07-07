<script setup lang="ts">
    import Header from './components/Header.vue'
    import Card from './components/Card.vue'
    import CardDialog from './components/CardDialog.vue'
    import { DialogMode, type CardIface } from '@/types.ts'
    import { add_card, delete_card, get_card_list, image_url, patch_card, preload_image_url, preload_image_urls, thumb_url, upload_image } from './api/api.ts'
    import { ref, computed, provide, onMounted } from 'vue'


    const cards = ref<CardIface[]>([])

    let isOpen = ref<boolean>(false)
    let dialogMode = ref<DialogMode>(DialogMode.Display)
    const currentCardID = ref<string | null>(null)

    const currentCard = computed(() => {
        if (!currentCardID.value) return undefined
        return cards.value.find(c => c.id === currentCardID.value)
    })

    function openDisplay(id: string) {
        isOpen.value = true
        dialogMode.value = DialogMode.Display
        currentCardID.value = id
    }

    function openNew() {
        isOpen.value = true
        dialogMode.value = DialogMode.New
        currentCardID.value = null
    }

    function handleMouseEnterCard(card: CardIface) {
        preload_image_url(card)
    }

    async function updateCard(id: string, updatedFields: Partial<CardIface>) {
        const index = cards.value.findIndex(c => c.id === id)
        if (index === -1) { return }

        const currentCard = cards.value[index]
        const originalCard = { ...cards.value[index] } as CardIface

        try {
            // Меняем клиенткуй часть
            Object.assign(cards.value[index]!, updatedFields)

            // Меняем текстовые данные на сервере
            let patchResponse = await patch_card(id, updatedFields)
            cards.value[index] = { ...cards.value[index], ...patchResponse.data } as CardIface
            if (patchResponse.status !== 200) {
                throw new Error(`PATCH card failed with status ${patchResponse.status}`)
            }
            // Меняем картинку на сервере
            if (updatedFields.image instanceof File) {
                let imageResponse = await upload_image(id, updatedFields.image as File)
                if (imageResponse.status !== 200) {
                    throw new Error(`Upload image failed with status ${imageResponse.status}`);
                }
                const newBigUrl = image_url(cards.value[index], false)
                const newThumbUrl = thumb_url(cards.value[index], false)

                const img = new Image()
                img.onload = () => { cards.value[index]!.image_url = newBigUrl }
                img.src = newBigUrl

                const thumb = new Image()
                thumb.onload = () => { cards.value[index]!.thumb_url = newThumbUrl }
                thumb.src = newThumbUrl
            }
        } catch (err) {
            console.error('updateCard error:', err)
            cards.value[index] = originalCard;
        }
    }

    async function addCard(newCard: CardIface) {
        let serverCard: CardIface | undefined = undefined
        
        try {
            cards.value.push(newCard)
            let addResponse = await add_card(newCard)
            if (addResponse.status !== 201) {
                throw new Error(`ADD card failed with status ${addResponse.status}`)
            }

            serverCard = addResponse.data as CardIface

            if (!(newCard.image instanceof File)) {
                throw new Error(`ADD card failed: image doesn't exist `)
            }
            let imageResponse = await upload_image(serverCard.id, newCard.image)
            if (imageResponse.status !== 200) {
                throw new Error(`Upload image failed with status ${imageResponse.status}`);
            }
            const newBigUrl = image_url(serverCard, false)
            const newThumbUrl = thumb_url(serverCard, false)

            const img = new Image()
            img.onload = () => { cards.value[index]!.image_url = newBigUrl }
            img.src = newBigUrl

            const thumb = new Image()
            thumb.onload = () => { cards.value[index]!.thumb_url = newThumbUrl }
            thumb.src = newThumbUrl

            const index = cards.value.findIndex(c => c.id === newCard.id)
            if (index !== -1) {
                Object.assign(cards.value[index]!, serverCard)
            }

        } catch (err) {
            console.error('addCard error:', err)

            cards.value = cards.value.filter(c => c.id !== newCard.id && c.id !== serverCard?.id)

            if (serverCard) {
                await delete_card(serverCard.id) 
            }
        }
    }

    async function deleteCard(id: string) {
        const index = cards.value.findIndex(c => c.id === id)
        if (index === -1) { return }
        
        const deletedCard = cards.value[index] as CardIface

        try {
            cards.value = cards.value.filter(c => c.id !== id)
            const deleteResponse = await delete_card(id)
            if (deleteResponse.status !== 204) {
                throw new Error(`DELETE card failed with status ${deleteResponse.status}`)
            }
        } catch (err) {
            console.error("deleteCard error:", err)
            cards.value.splice(index, 0, deletedCard)
        }
    }

    onMounted(async () => {
        try {
            const data = await get_card_list(0, 20)
            cards.value = data.items
            cards.value.forEach(c => {
                c.image_url = image_url(c)
                c.thumb_url = thumb_url(c)
            })
        } catch (err) {
            console.log(err)
        }
        preload_image_urls(cards.value)
    })

    provide("updateCard", updateCard)
    provide("addCard", addCard)
    provide("deleteCard", deleteCard)

</script>

<template>
    <div>
        <CardDialog
            v-model:isOpen="isOpen"
            v-model:dialogMode="dialogMode"
            :card="currentCard"
        />

        <div class="bg-white w-4/5 m-auto shadow-xs w-5/6 h-min-screen">
            
            <Header
                @open-dialog-new="openNew"
            />

            <!-- <div class="flex justify-between px-16 mt-4">
                <h1 class="text-2xl">Catalog</h1>
                <div class="relative">
                    <img 
                        src="/search.svg" alt="search"
                        class="absolute left-3 top-2 h-5 opacity-50"
                    >
                    <input 
                        type="text" placeholder="Search..."
                        class="border border-gray-300 rounded-md pl-10 pr-4 py-2 outline-none focus:border-gray-400 text-sm"
                    >
                </div>
            </div> -->

            <div class="grid md:grid-cols-4 sm:grid-cols-3 gap-8 px-16 py-4">
                <Card
                    v-for="card in cards"
                    :key="card.id"
                    :imageUrl="card.thumb_url"
                    :title="card.title"
                    :difficulty="card.difficulty"
                    :isComplete="card.completed"
                    @click="openDisplay(card.id)"
                    @mouseenter="handleMouseEnterCard(card)"
                />
            </div>

        </div>
    </div>
</template>


<style scoped></style>
