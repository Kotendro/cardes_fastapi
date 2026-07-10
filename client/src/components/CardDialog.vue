<script setup lang="ts">
    import DisplayMode from './DisplayMode.vue'
    import EditMode from './EditMode.vue'
    import NewMode from './NewMode.vue'
    import { type CardIface, DialogMode } from '@/types.ts'

    const isOpen = defineModel<boolean>('isOpen', { required: true })
    const dialogMode = defineModel<DialogMode>('dialogMode', { required: true })

    const props = defineProps<{
        card?: CardIface,
    }>()
</script>


<template>
    <div v-if="isOpen">
        <div class="fixed top-0 left=0 h-full w-full bg-black/50 z-10"></div>
        <div class="fixed inset-0 z-20 flex justify-center overflow-y-auto py-5">
            <div class="bg-white rounded-xl relative w-[360px] my-auto">     
                <img 
                    src="/close.svg"
                    alt="close"
                    class="h-5 absolute -top-3.5 -right-5 z-50 opacity-50 hover:opacity-70"
                    @click="isOpen = false"
                >

                <DisplayMode
                    v-if="dialogMode === DialogMode.Display && props.card"
                    @dialog-edit="dialogMode = DialogMode.Edit"
                    :card="props.card"
                />

                <EditMode
                    v-if="dialogMode === DialogMode.Edit && props.card"
                    @dialog-display="dialogMode = DialogMode.Display"
                    @close-dialog="isOpen = false"
                    :card="props.card"
                />

                <NewMode
                    v-if="dialogMode === DialogMode.New"
                    @close-dialog="isOpen = false"
                />
                
            </div>
        </div>
    </div>

</template>