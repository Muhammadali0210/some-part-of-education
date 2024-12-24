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
    title: z.string().max(30, {
      message: "Kurs nomi 30 ta belgidan oshmasligi kerak",
    }),
  })
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
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
    <h1 v-else class="font-normal">{{ props.course?.title }}</h1>
  </div>
  <div v-else>
    <form @submit.prevent="onSubmit">
      <div class="space-y-3">
        <FormField v-slot="{ field, errors }" name="title">
          <FormItem>
            <FormLabel>Kurs nomi <span class="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input
                type="text"
                :default-value="props.course?.title"
                v-model="field.value"
                v-bind="field"
              />
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
