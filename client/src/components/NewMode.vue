<script setup lang="ts">
    import Tag from './Tag.vue'
    import { type CardIface, DialogMode } from '@/types.ts'
    import { inject, ref } from 'vue';

    const emit = defineEmits(["close-dialog"])

    const draftCard = ref<CardIface>({
        id: crypto.randomUUID(),
        title: '',
        difficulty: 1,
        completed: false,
        tags: [],
        description: '',
    })

    const addCard = inject<(newCard: CardIface) => void>("addCard")

    function saveCardBtn() {
        if (addCard) {
            addCard({ ...draftCard.value })
            emit('close-dialog')
        }
    }

    function setDifficulty(difficulty: number) {
        draftCard.value.difficulty = difficulty
    }

    function deleteTag(tag_name: string) {
        draftCard.value.tags = draftCard.value.tags.filter(tag => tag != tag_name)
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
        const value = target.value
        
        if (value)
            draftCard.value.tags.push(value)
            target.value = ''
    }

</script>

<template>
    <div>
        <div>
            <label v-if="draftCard.image" for="fileInput">
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

            <label v-else for="fileInput" class="cursor-pointer flex justify-center py-3 border-b border-gray-200">
                <div class="flex flex-col items-center">
                    <span class="text-gray-400 font-bold">Select a file</span>
                    <span class="text-sm text-gray-400">idk format</span>
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

            <div class="flex gap-1 w-80 overflow-auto">
                <Tag
                    v-for="(tag, index) in draftCard.tags"
                    :key="index"
                    :tagText="tag"
                    :dialogMode="DialogMode.Edit"
                    class="cursor-pointer flex-shrink-0"
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

        <div class="flex justify-between px-3 py-2">
            <span class="text-gray-400 -mt-0.5 text-sm">Edit mode</span>
            <div class="flex justify-end gap-2">
                <img 
                    src="/save.svg"
                    alt="save"
                    class="w-5 opacity-50 hover:opacity-70 cursor-pointer"   
                    @click="saveCardBtn"
                >
            </div>
        </div>
    </div>
</template>