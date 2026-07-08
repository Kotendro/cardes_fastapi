<script setup lang="ts">
    import Header from './components/Header.vue'
    import Card from './components/Card.vue'
    import CardDialog from './components/CardDialog.vue'
    import Pagination from './components/Pagination.vue'
    import { DialogMode, type CardIface } from '@/types.ts'
    import { addCardRequest, deleteCardRequest, getCardListRequest, imageURL, patchCardRequest, preloadImageURL, preloadImageURLs, thumbURL, uploadImageRequest } from './api/api.ts'
    import { ref, computed, provide, onMounted } from 'vue'


    const cards = ref<CardIface[]>([])
    const totalCards = ref<number>(0) // Всего карточек из запроса
    const currentPage = ref<number>(0) // Текущая страница
    const limit = 10 // Максимум карт на странице

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
        preloadImageURL(card)
    }

    async function patchCard(id: string, updatedFields: Partial<CardIface>) {
        const index = cards.value.findIndex(c => c.id === id)
        if (index === -1) { return }

        const originalCard = { ...cards.value[index] } as CardIface

        try {
            // Меняем клиенткуй часть
            Object.assign(cards.value[index]!, updatedFields)

            // Меняем текстовые данные на сервере
            let patchResponse = await patchCardRequest(id, updatedFields)
            cards.value[index] = { ...cards.value[index], ...patchResponse.data } as CardIface
            if (patchResponse.status !== 200) {
                throw new Error(`PATCH card failed with status ${patchResponse.status}`)
            }
            // Меняем картинку на сервере
            if (updatedFields.image instanceof File) {
                let imageResponse = await uploadImageRequest(id, updatedFields.image as File)
                if (imageResponse.status !== 200) {
                    throw new Error(`Upload image failed with status ${imageResponse.status}`);
                }
                const newBigUrl = imageURL(cards.value[index], false)
                const newThumbUrl = thumbURL(cards.value[index], false)

                const img = new Image()
                img.onload = () => { cards.value[index]!.image_url = newBigUrl }
                img.src = newBigUrl

                const thumb = new Image()
                thumb.onload = () => { cards.value[index]!.thumb_url = newThumbUrl }
                thumb.src = newThumbUrl
            }
        } catch (err) {
            console.error('patchCard error:', err)
            cards.value[index] = originalCard;
        }
    }

    async function addCard(newCard: CardIface) {
        let serverCard: CardIface | undefined = undefined
        
        try {
            cards.value.push(newCard)
            let addResponse = await addCardRequest(newCard)
            if (addResponse.status !== 201) {
                throw new Error(`ADD card failed with status ${addResponse.status}`)
            }

            serverCard = addResponse.data as CardIface

            if (!(newCard.image instanceof File)) {
                throw new Error(`ADD card failed: image doesn't exist `)
            }
            let imageResponse = await uploadImageRequest(serverCard.id, newCard.image)
            if (imageResponse.status !== 200) {
                throw new Error(`Upload image failed with status ${imageResponse.status}`);
            }
            const newBigUrl = imageURL(serverCard, false)
            const newThumbUrl = thumbURL(serverCard, false)

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
                await deleteCardRequest(serverCard.id) 
            }
        }
    }

    async function deleteCard(id: string) {
        const index = cards.value.findIndex(c => c.id === id)
        if (index === -1) { return }
        
        const deletedCard = cards.value[index] as CardIface

        try {
            cards.value = cards.value.filter(c => c.id !== id)
            const deleteResponse = await deleteCardRequest(id)
            if (deleteResponse.status !== 204) {
                throw new Error(`DELETE card failed with status ${deleteResponse.status}`)
            }
        } catch (err) {
            console.error("deleteCard error:", err)
            cards.value.splice(index, 0, deletedCard)
        }
    }

    async function getCardList(page: number) {
        try {
            currentPage.value = page
            const data = await getCardListRequest(page, limit)
            cards.value = data.items
            totalCards.value = data.total
            cards.value.forEach(c => {
                c.image_url = imageURL(c)
                c.thumb_url = thumbURL(c)
            })
            preloadImageURLs(cards.value)
        } catch (err) {
            console.error("getCardList error:", err)
        }
    }

    onMounted(() => {
        getCardList(currentPage.value);
    })

    provide("patchCard", patchCard)
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

        <div class="flex flex-col items-center justify-center px-3 w-full">
            <div class="w-full max-w-max bg-white shadow-xs rounded-lg mt-3 mb-16 p-4">
                
                <Header
                    @open-dialog-new="openNew"
                />


                <div class="mt-4">
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 justify-center">
                        <Card
                            v-for="card in cards"
                            class="w-[170px]"
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

            <Pagination 
                :currentPage="currentPage"
                :totalCards="totalCards"
                :limit="limit"
                @page-changed="getCardList"
            />
        </div>
    </div>
</template>


<style scoped></style>
