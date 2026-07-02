<script setup lang="ts">
    const emit = defineEmits(["open-dialog-new"])

</script>

<template>
    <header class="flex justify-between border-b border-gray-200 px-16 py-4">
        <div class="flex flex-col">
            <h1 class="text-xl font-bold">Cardes</h1>
            <span class="text-gray-500 -mt-2 text-sm">your achievements</span>
        </div>
        <ul class="flex place-items-center">
            <li @click="$emit('open-dialog-new')" class="flex place-items-center gap-2 group">
                <img src="/newCard.svg" alt="New card" class="h-5 align-middle opacity-50 group-hover:opacity-70">
                <span class="text-gray-500 -mt-0.5 cursor-pointer group-hover:text-gray-600">New card</span>
            </li>
        </ul>
    </header>    
</template>