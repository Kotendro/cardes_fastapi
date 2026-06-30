<script setup lang="ts">
    import DisplayMode from './DisplayMode.vue'
    import EditMode from './EditMode.vue'
    import type { CardIface } from '@/types.ts'

    const props = defineProps<{
        card: CardIface,
        isOpen: boolean,
        isEditMode: boolean,
    }>()

    const emit = defineEmits(["close-dialog"])
    

</script>


<template>
    <div v-show="isOpen">
        <div class="fixed top-0 left=0 h-full w-full bg-black/50 z-10"></div>
        <div class="fixed inset-0 z-20 flex items-center justify-center">
            <div class="bg-white rounded-xl relative">     
                <img 
                    src="/close.svg"
                    alt="close"
                    class="h-5 absolute -left-5  z-50 opacity-50 hover:opacity-70"
                    @click="$emit('close-dialog')"
                >

                <DisplayMode
                    v-if="!isEditMode"
                    :card="card"
                />

                <EditMode
                    v-else
                    :card="card"
                />
                
            </div>
        </div>
    </div>

</template>