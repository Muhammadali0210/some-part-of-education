<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator';
import { Edit2, X } from "lucide-vue-next";
import useToggleEdit from '@/hooks/use-toggle-edit';
import { watch } from 'vue';
const {state, onToggle} = useToggleEdit();

const props = defineProps({
    name: String,
    isUpdated: Boolean
})


watch(() => props.isUpdated, () => {
    if(state.value){
        onToggle();
    }
})

</script>
<template>
    <Card>
        <CardHeader class="pb-2">
            <div class="flex items-center justify-between">
                <CardTitle>{{ name }}</CardTitle>
                <Button variant="ghost" @click="onToggle()">
                    <X v-if="state" />
                    <Edit2 v-else />
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <Separator class="mb-2" />
            <slot :state="state"></slot>
        </CardContent>
    </Card>
</template>