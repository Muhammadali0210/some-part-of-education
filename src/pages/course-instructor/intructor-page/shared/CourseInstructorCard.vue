<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle
} from "@/components/ui/card";

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})
</script>
<template>
    <Card v-if="data" class="p-2">
        <CardContent class="p-0 rounded-sm overflow-hidden">
            <img :src="data.previewImage === null ? '../../assets/image/emptyimg.png' : data.previewImage" alt="course rasm" class="w-full h-[200px] object-cover">
        </CardContent>
        <CardFooter class="flex justify-between p-0 mt-3">
          <CardTitle>{{ data.title }}</CardTitle>
          <Button>{{ data.published ? "Ochish" : "Yopish" }}</Button>
        </CardFooter>
    </Card>
</template>