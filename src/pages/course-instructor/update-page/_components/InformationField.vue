<script setup lang="ts">
import SubmitButton from "../shared/SubmitButton.vue";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import * as z from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useUpdateCourseInfo } from "../service";

const { isLoading, data, updateCourseInfo } = useUpdateCourseInfo();
const props = defineProps({
  state: Boolean,
  course: Object
})

const formSchema = toTypedSchema(
  z.object({
    learning: z.string().max(400, {
      message: "Kurs nomi 400 ta belgidan oshmasligi kerak",
    }),
    requirements: z.string().max(400, {
      message: "Kurs nomi 400 ta belgidan oshmasligi kerak",
    }),
    tags: z.string().max(400, {
      message: "Kurs teglari 400 ta belgidan oshmasligi kerak",
    }),
  })
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema
});

const emit  = defineEmits<{
  (e: 'onUpdated', data: any): void;
}>()

const onSubmit = handleSubmit(async (values) => {
  await updateCourseInfo(Number(props.course?._id), values);
  emit('onUpdated', data);
  resetForm();
})
</script>
<template>
    <div v-if="!state">
      <div v-if="isLoading || !course">
        <Skeleton class="h-[22px] w-full mb-2" />
        <Skeleton class="h-[22px] w-[50%] mb-3" />
        <Skeleton class="h-[22px] w-full mb-2" />
        <Skeleton class="h-[22px] w-[40%]" />
      </div>
      <div v-else>
        <h1 class="font-semibold">Nimalarni o'rgatadi:</h1>
        <p class="font-normal dark:text-gray-400 max-h-[400px] overflow-y-auto mb-2">{{ props.course?.learning }}</p>
        <h1 class="font-semibold">Talablar:</h1>
        <p class="font-normal dark:text-gray-400 max-h-[400px] overflow-y-auto">{{ props.course?.requirements }}</p>
        <h1 class="font-semibold">Teglar:</h1>
        <p class="font-normal dark:text-gray-400 max-h-[400px] overflow-y-auto">{{ props.course?.tags }}</p>
      </div>
    </div>
    <div v-else>
      <form @submit.prevent="onSubmit">
        <div class="space-y-3">
          <FormField v-slot="{ field, errors }" name="learning">
            <FormItem>
              <FormControl>
                <FormLabel>Nimalarni o'rgatadi <span class="text-red-500">*</span></FormLabel>
                <Textarea type="text" :default-value="props.course?.learning" v-model="field.value" v-bind="field" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ field, errors }" name="requirements">
            <FormItem>
              <FormControl>
                <FormLabel>Talablar <span class="text-red-500">*</span></FormLabel>
                <Textarea type="text" :default-value="props.course?.requirements" v-model="field.value" v-bind="field" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ field, errors }" name="tags">
            <FormItem>
              <FormControl>
                <FormLabel>Teglar <span class="text-red-500">*</span></FormLabel>
                <Textarea type="text" :default-value="props.course?.tags" v-model="field.value" v-bind="field" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="flex">
            <SubmitButton :is-loading="isLoading" />
          </div>
        </div>
      </form>
    </div>
</template>