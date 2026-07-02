<script setup lang="ts">
    defineProps<{
        imageUrl?: string
        title?: string
        difficulty?: number
        isComplete?: boolean
    }>()
</script>

<template>
    <div 
        class="
            relative rounded-md overflow-hidden shadow-xs group cursor-pointer
            hover:-translate-y-1 hover:shadow-xl transition"
        :class="{ 'grayscale-95' : !isComplete}"
    >
        <img :src="imageUrl" class="w-full">
        <div class="
            absolute inset-x-0 bottom-0 py-2 flex flex-col place-items-center bg-black/50 backdrop-blur-sm
            opacity-0 group-hover:opacity-100 transition-opacity duration-50
        ">
            <div class="flex">
                <img
                    v-for="i in difficulty"
                    :key="i"
                    src="/star.svg"
                    alt="star"
                    class="w-5 filter brightness-0 invert"
                >
            </div>
            <h1 class="text-white text-lg font-bold">{{ title }}</h1>
        </div>
    </div>
</template>

