<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-vue-next';
const props = defineProps({
    isLoading: Boolean
})
</script>
<template>
    <Button type="submit">
        <template v-if="!isLoading">
            Saqlash
        </template>
        <template v-else>
            <Loader class="animate-spin" /> Yuborilmoqda...
        </template>
    </Button>
</template>