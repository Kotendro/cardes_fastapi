<script setup lang="ts">
    import Tag from './Tag.vue'
    import { type CardIface, DialogMode } from '@/types.ts'
    import { inject, ref, toRaw } from 'vue';

    const props = defineProps<{
        card: CardIface
    }>()

    const draftCard = ref<CardIface>({ 
        ...props.card,
        tags: props.card.tags ? [...props.card.tags] : []
    })

    const emit = defineEmits(["dialog-display", "close-dialog"])

    const patchCard = inject<(id: string, fields: Partial<CardIface>) => void>("patchCard")
    const deleteCard = inject<(id: string) => void>("deleteCard")

    function saveCardBtn() {
        if (patchCard) {
            patchCard(props.card.id, { ...draftCard.value })
            emit("dialog-display")
        }
    }

    function deleteCardBtn() {
        if (deleteCard) {
            emit("close-dialog")
            deleteCard(props.card.id)
        }
    }


    function setDifficulty(difficulty: number) {
        draftCard.value.difficulty = difficulty
    }

    function deleteTag(tag_name: string) {
        draftCard.value.tags = draftCard.value.tags.filter(tag => tag !== tag_name)
    }

    function setImage(event: Event) {
        const fileInputElement = event.target as HTMLInputElement
        
        if (!fileInputElement.files || fileInputElement.files.length === 0) {
            return
        }

        draftCard.value.image = fileInputElement.files[0] as File
        draftCard.value.image_url = URL.createObjectURL(draftCard.value.image)
        draftCard.value.thumb_url = URL.createObjectURL(draftCard.value.image)
    }

    function addTag(event: KeyboardEvent) {
        const target = event.target as HTMLInputElement
        const value = target.value.trim().toLocaleLowerCase()
        
        if (value) {
            draftCard.value.tags.push(value)
            target.value = ''
        }
    }

</script>

<template>
    <div>
        <div>
            <label for="fileInput">
                <div class="relative flex justify-center items-center group cursor-pointer">
                    <img 
                        :src="draftCard.image_url"
                        alt="card"
                        class="w-full"
                    >
                    <img 
                        src="/replace.svg"
                        alt="replace"
                        class="h-45 absolute opacity-0 group-hover:opacity-80 transition"
                    >
                </div>
            </label>

            <input 
                v-show="false"
                @change="setImage($event)"
                type="file"
                id="fileInput"
            >
        </div>
        
        <div class="px-3 py-1 border-b border-gray-200">
            <div class="flex justify-between">
                <input
                    placeholder="*Title"
                    class="outline-none text-xl font-bold min-w-0"
                    v-model="draftCard.title"
                >
                <div class="flex flex-shrink-0">
                    <img
                        v-for="i in draftCard.difficulty"
                        :key="i"
                        src="/star.svg"
                        alt="star" 
                        class="w-6 hover:contrast-60 cursor-pointer"
                        @click="setDifficulty(i)"
                    >
                    <img
                        v-for="i in (5-draftCard.difficulty)"
                        :key="i"
                        src="/star.svg"
                        alt="star" 
                        class="w-6 contrast-0 hover:contrast-20 cursor-pointer"
                        @click="setDifficulty(i + draftCard.difficulty)"
                    >
                </div>
            </div>

            <div class="flex gap-1 w-80 flex-wrap overflow-auto">
                <Tag
                    v-for="(tag, index) in draftCard.tags"
                    :key="index"
                    :tagText="tag"
                    :dialogMode="DialogMode.Edit"
                    class="cursor-pointer"
                    @click="deleteTag(tag)"
                />
                <input
                    placeholder="Add tag"
                    type="text"
                    class="outline-none field-sizing-content"
                    @keydown.enter="addTag($event)"
                >
            </div>

            <textarea placeholder="Description" class="block w-full field-sizing-content overflow-y-auto outline-none resize-none" v-model="draftCard.description"></textarea>
        </div>
        <div class="flex flex-col px-3 py-2 gap-2">

            <div class="flex justify-between items-center">
                <span class="text-gray-400 -mt-0.5 text-sm">Edit mode</span>
                <div class="flex justify-end gap-2">
                    <img 
                        src="/previous.svg"
                        alt="previous"
                        class="w-5 opacity-50 hover:opacity-70 cursor-pointer"
                        @click="$emit('dialog-display')"
                    >
                    <img 
                        src="/delete.svg"
                        alt="previous"
                        class="w-5 opacity-50 hover:opacity-70 cursor-pointer"
                        @click="deleteCardBtn"
                    >
                    <img 
                        src="/save.svg"
                        alt="save"
                        class="w-5 opacity-50 hover:opacity-70 cursor-pointer"   
                        @click="saveCardBtn"
                    >
                </div>
            </div>
        </div>
    </div>
</template>