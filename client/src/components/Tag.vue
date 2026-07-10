<script setup lang="ts">
    import { DialogMode } from '@/types';
    import { ref } from 'vue';

    defineProps<{
        tagText: string
        dialogMode?: DialogMode
    }>()

    const isHovered = ref<boolean>(false)

</script>

<template>
    <div
        class="group flex place-items-center bg-gray-100 rounded-xl px-2 py-0.5 my-0.5"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
    >
        <span>{{ tagText }}</span>
        
        <img
            v-if="dialogMode === DialogMode.Edit"
            src="/close2.svg" alt="close"
            class="h-5 mt-0.5 opacity-50 group-hover:opacity-70"
        >
    </div>
</template>