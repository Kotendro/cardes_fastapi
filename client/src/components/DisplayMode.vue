<script setup lang="ts">
    import Tag from './Tag.vue'
    import { type CardIface } from '@/types.ts'
    import { inject } from 'vue';

    const props = defineProps<{
        card: CardIface
    }>()

    const emit = defineEmits(['dialog-edit'])

    const patchCard = inject<(id: string, fields: Partial<CardIface>) => void>("patchCard")
    
    function completeCardBtn() {
        if (patchCard) {
            patchCard(props.card.id, { completed: !props.card.completed })
        }
    }

</script>

<template>
    <div>
        <div>
            <img 
                :src="card.image_url"
                alt="cover"
                class="w-full" 
                :class="{ 'grayscale-95' : !card.completed}"
            >
        </div>
        
        <div class="px-3 py-1 border-b border-gray-200">
            <div class="flex justify-between">
                <h1 class="text-xl font-bold">{{ card.title }}</h1>
                <div class="flex flex-shrink-0">
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

            <p class="w-full field-sizing-content overflow-y-auto">{{ card.description }}</p>
        </div>

        <div class="flex justify-between px-3 py-2">
            <span class="text-gray-400 -mt-0.5 text-sm">Display mode</span>
            <div class="flex justify-end gap-2">
                <img
                    src="/complete2.svg"
                    alt="complete"
                    @click="completeCardBtn"
                    class="w-5 opacity-50 hover:opacity-70 cursor-pointer">
                <img 
                    src="/edit.svg"
                    alt="edit"
                    class="w-5 opacity-50 hover:opacity-70 cursor-pointer"
                    @click="$emit('dialog-edit')">
            </div>
        </div>
    </div>
</template>