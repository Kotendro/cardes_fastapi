<script setup lang="ts">
    import Header from './components/Header.vue'
    import Card from './components/Card.vue'
    import CardDialog from './components/CardDialog.vue'
    import type { CardIface } from '@/types.ts'

    import { ref, reactive } from 'vue'

    const cards = reactive<CardIface[]>([
        {id: 1, imageUrl: "/USA.png", title: "Пройти за USA", difficulty: 4, isComplete: false, tags: ["хочу", "red alert 3"], description: "Какой-то текст"},
        {id: 2, imageUrl: "/USSR.png", title: "Пройти за USSR", difficulty: 3, isComplete: false, tags: ["не хочу", "red alert 3"], description: "Какой-то текст"},
        {id: 3, imageUrl: "/JAPAN.png", title: "Пройти за JAPAN", difficulty: 5, isComplete: false, tags: ["ANIME"], description: "Какой-то текст"},
    ])

    let isOpen = ref<boolean>(false)
    let isEditMode = ref<boolean>(false)
    let currentCardID = ref<number | null>(null)

    function openDisplay(index: number) {
        isOpen.value = true
        isEditMode.value = false
        currentCardID.value = index
        console.log("open event")
    }

    function closeDialog() {
        isOpen.value = false
        currentCardID.value = null
    }

</script>

<template>
    <div>
        <CardDialog
            v-if="currentCardID !== null"
            :card="cards[currentCardID]!"
            v-model:isEditMode="isEditMode"
            v-model:isOpen="isOpen"
            @close-dialog="closeDialog()"
        />

        <div class="bg-white w-4/5 m-auto rounded-xl shadow-xs my-8">
            
            <Header />

            <div class="flex justify-between px-16 mt-4">
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
            </div>

            <div class="grid grid-cols-4 gap-8 px-16 py-4">
                <Card
                    v-for="card, index in cards"
                    :key="card.id"
                    :imageUrl="card.imageUrl"
                    :title="card.title"
                    :difficulty="card.difficulty"
                    :isComplete="card.isComplete"
                    @click="openDisplay(index)"
                />
            </div>

        </div>
    </div>
</template>


<style scoped></style>
