<script setup lang="ts">
    import Tag from './Tag.vue'
    import type { CardIface } from '@/types.ts'

    defineProps<{
        card: CardIface
    }>()

</script>

<template>
    <div>
        <img 
            :src="card.imageUrl"
            alt="USA"
            class="w-full"
            :class="{ 'grayscale-95' : !card.isComplete}"
        >
        
        <div class="px-3 py-1 border-b border-gray-200">
            <div class="flex justify-between">
                <input class="text-xl font-bold" :value="card.title">
                <div class="flex">
                    <img
                        v-for="i in card.difficulty"
                        :key="i"
                        src="/star.svg"
                        alt="star" 
                        class="w-6"
                    >
                    <img
                        v-for="i in (5-card.difficulty)"
                        :key="i"
                        src="/star.svg"
                        alt="star" 
                        class="w-6 contrast-0"
                    >
                </div>
            </div>

            <div class="flex gap-1 w-80 overflow-auto">
                <Tag v-for="(tag, index) in card.tags" :key="index" :tagText="tag"/>
            </div>

            <textarea class="w-80 max-h-24 overflow-y-auto">{{ card.description }}</textarea>
        </div>

        <div class="flex justify-between px-3 py-2">
            <span class="text-gray-400 -mt-0.5 text-sm">Edit mode</span>
            <div class="flex justify-end gap-2">
                <img
                    src="/complete2.svg"
                    alt="complete"
                    class="w-5 opacity-50 hover:opacity-70">
                <img src="/edit.svg" alt="edit" class="w-5 opacity-50 hover:opacity-70">
            </div>
        </div>
    </div>
</template>