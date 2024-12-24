<script lang="ts" setup>
import { Skeleton } from '@/components/ui/skeleton'
</script>

<template>
    <div class="mt-4 grid grid-cols-3 gap-4 w-full max-lg:grid-cols-2 max-md:grid-cols-1">
        <div v-for="i in 5" :key="i" class="flex flex-col space-y-2 p-2">
            <Skeleton class="h-[210px] w-full rounded-xl" />
            <div class="flex items-center justify-between">
                <div class="space-y-2">
                    <Skeleton class="h-4 w-[170px]" />
                    <Skeleton class="h-4 w-[140px]" />
                </div>
                <Skeleton class="h-8 w-[80px]" />
            </div>
        </div>
    </div>
</template>