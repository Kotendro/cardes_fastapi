<script setup lang="ts">
    import Header from './components/Header.vue'
    import Card from './components/Card.vue'
    import CardDialog from './components/CardDialog.vue'
    import { DialogMode, type CardIface } from '@/types.ts'
    import { get_card_list, image_url, patch_card, preload_image_url, preload_image_urls, thumb_url } from './api/api.ts'
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

    async function updateCard(id: string, updatedFields: Partial<CardIface>) {
        const index = cards.value.findIndex(c => c.id === id)
        if (index === -1) {
            return
        }
        const originalCard = { ...cards.value[index] }

        cards.value[index] = { ...cards.value[index], ...updatedFields } as CardIface

        const response = await patch_card(id, updatedFields)
        cards.value[index] = { ...cards.value[index], ...response.data} as CardIface

        cards.value[index].image_url = image_url(cards.value[index], false)
        cards.value[index].thumb_url = thumb_url(cards.value[index], false)
        preload_image_url(cards.value[index])

        if (response.status !== 200) {
            console.log(`updateCard error: STATUS ${response.status}`)
            cards.value[index] = originalCard as CardIface
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
    provide("dialogMode", dialogMode)

</script>

<template>
    <div>
        <CardDialog
            v-model:isOpen="isOpen"
            v-model:dialogMode="dialogMode"
            :card="currentCard"
        />

        <div class="bg-white w-4/5 m-auto rounded-xl shadow-xs my-8">
            
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

            <div class="grid grid-cols-4 gap-8 px-16 py-4">
                <Card
                    v-for="card in cards"
                    :key="card.id"
                    :imageUrl="card.thumb_url"
                    :title="card.title"
                    :difficulty="card.difficulty"
                    :isComplete="card.completed"
                    @click="openDisplay(card.id)"
                />
            </div>

        </div>
    </div>
</template>


<style scoped></style>
