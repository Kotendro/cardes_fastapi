<script setup lang="ts">

    defineProps<{
        tagText: string
    }>()

</script>

<template>
    <div class="bg-gray-100 rounded-xl px-2 py-0.5 my-0.5">
        <span>{{ tagText }}</span>
    </div>
</template>