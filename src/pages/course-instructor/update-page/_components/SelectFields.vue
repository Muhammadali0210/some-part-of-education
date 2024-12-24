<script setup lang="ts">
import SubmitButton from "../shared/SubmitButton.vue";
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    level: z.string(),
    category: z.string(),
    language: z.string(),
  })
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    level: props.course?.level,
    category: props.course?.category,
    language: props.course?.language
  }
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
      </div>
      <div v-else>
        <div class="flex gap-2">
            <h1 class="font-semibold">Darajasi:</h1>
            <p class="font-normal dark:text-gray-400 max-h-[400px] overflow-y-auto mb-2">{{ props.course?.level }}</p>
        </div>
        <div class="flex gap-2">
            <h1 class="font-semibold">Kategoriya:</h1>
            <p class="font-normal dark:text-gray-400 max-h-[400px] overflow-y-auto">{{ props.course?.category }}</p>
        </div>
        <div class="flex gap-2">
            <h1 class="font-semibold">Til:</h1>
            <p class="font-normal dark:text-gray-400 max-h-[400px] overflow-y-auto">{{ props.course?.language }}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <form @submit.prevent="onSubmit">
        <div class="space-y-3">
            <FormField v-slot="{ field, errors }" name="level">
              <FormItem>
                <FormLabel>Darajasi <span class="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Select v-bind="field" :default-value="props.course?.level">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="beginner"> Boshlang'ich </SelectItem>
                        <SelectItem value="middle"> O'rta </SelectItem>
                        <SelectItem value="high"> Yuqori </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ field, errors }" name="category">
              <FormItem>
                <FormLabel>Kategoriya <span class="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Select v-bind="field" :default-value="props.course?.category">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="grammatika"> Gramatika </SelectItem>
                        <SelectItem value="topik"> Topik </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ field, errors }" name="language">
              <FormItem>
                <FormLabel>Til <span class="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Select v-bind="field" :default-value="props.course?.language">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="uzb"> O'zbekcha </SelectItem>
                        <SelectItem value="eng"> Inglizcha </SelectItem>
                        <SelectItem value="kor"> Korescha </SelectItem>
                        <SelectItem value="rus"> Ruscha </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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