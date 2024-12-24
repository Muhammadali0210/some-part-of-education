<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useUpdateCourseInfo } from "../service";
import { Skeleton } from "@/components/ui/skeleton";
import SubmitButton from "../shared/SubmitButton.vue";

const { isLoading, data, updateCourseInfo } = useUpdateCourseInfo();
const props = defineProps({
  state: Boolean,
  course: Object,
});

const formSchema = toTypedSchema(
  z.object({
    oldPrice: z.number().min(0),
    currentPrice: z.number().min(0),
  })
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    oldPrice: props.course?.oldPrice,
    currentPrice: props.course?.currentPrice,
  },
});

const emit = defineEmits<{
  (e: "onUpdated", data: any): void;
}>();

const onSubmit = handleSubmit(async (values) => {
  await updateCourseInfo(Number(props.course?._id), values);
  emit("onUpdated", data);
  resetForm();
});
</script>
<template>
  <div v-if="!state" class="flex">
    <Skeleton v-if="isLoading || !course" class="h-[22px] w-[190px]" />
    <div v-else>
      <div class="flex gap-2">
        <h1 class="font-semibold">Eski narx:</h1>
        <p class="font-normal dark:text-gray-400 max-h-[400px] overflow-y-auto mb-2">
          {{ props.course?.oldPrice }}
        </p>
      </div>
      <div class="flex gap-2">
        <h1 class="font-semibold">Yangi narx:</h1>
        <p class="font-normal dark:text-gray-400 max-h-[400px] overflow-y-auto">
          {{ props.course?.currentPrice }}
        </p>
      </div>
    </div>
  </div>
  <div v-else>
    <form @submit.prevent="onSubmit">
      <div class="space-y-3">
        <FormField v-slot="{ field, errors }" name="oldPrice">
          <FormItem>
            <FormLabel>Eski narx <span class="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Kurs eski narxini kiriting"
                :default-value="props.course?.oldPrice"
                v-bind="field"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ field, errors }" name="currentPrice">
          <FormItem>
            <FormLabel>Yangi narx <span class="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Kurs yangi narxini kiriting"
                :default-value="props.course?.currentPrice"
                v-bind="field"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div>
          <SubmitButton :is-loading="isLoading" />
        </div>
      </div>
    </form>
  </div>
</template>
