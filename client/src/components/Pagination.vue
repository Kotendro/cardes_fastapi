<script setup lang="ts">
    import { computed } from 'vue';

    const currentPage = defineModel<number>({ required: true})

    const props = defineProps<{
        totalCards: number
        limit: number
    }>()

    const emit = defineEmits<{
        (e: 'page-changed', page: number): void
    }>()

    const leftLimit = 2
    const rightLimit = 2

    const lastPage = computed(() => {
        return Math.ceil(props.totalCards/props.limit)-1
    })

    // Я так горжусь собой за эту реализацию 
    const slice = computed<number>(() => {
        // Сколько элементов должно уйти в другую сторону
        if (currentPage.value < leftLimit) {
            return leftLimit-currentPage.value
        } else if (currentPage.value+rightLimit > lastPage.value) {
            return -(currentPage.value+rightLimit - lastPage.value)
        } else {
            return 0
        }
    })

    const pagePagination = computed<number[]>(() => {
        const res = []
        let start = Math.max(currentPage.value-leftLimit+slice.value, 0)
        let end = Math.min(currentPage.value+rightLimit+slice.value, lastPage.value)
        for (start; start <= end; start++) {
            res.push(start)
        }
        return res
    })
</script>

<template>
    <div 
        v-if="pagePagination.length > 1"
        class="fixed bg-white shadow-xs rounded-lg px-1 bottom-3"
    >
        <img 
            v-if="currentPage !== 0" 
            src="/next.svg" alt="next" 
            class="cursor-pointer h-4.5 inline pr-1 -mt-1 opacity-50 hover:opacity-70 -scale-x-100 cursor-pointer"
            @click="currentPage -= 1"
        >
        <button
            v-for="i in pagePagination" :key="i"
            :class="[
                    'm-1 cursor-pointer text-gray-500 px-2 py-1 rounded', 
                    i === currentPage 
                        ? 'bg-gray-400 text-white font-bold hover:bg-gray-500'
                        : 'hover:bg-gray-200'
                ]"
            @click="currentPage = i"
        >
            {{i+1}}
        </button>
        <img 
            v-if="currentPage !== lastPage" 
            src="/next.svg" alt="next" 
            class="cursor-pointer h-4.5 inline pr-1 -mt-1 opacity-50 hover:opacity-70"
            @click="currentPage += 1"
        >
    </div>
</template>
