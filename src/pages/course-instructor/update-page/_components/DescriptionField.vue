<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Button } from '@/components/ui/button'
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
import { Loader } from "lucide-vue-next";
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
    description: z.string().max(500, {
      message: "Kurs haqidagi malumot 500 ta belgidan oshmasligi kerak",
    }),
  })
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    description: props.course?.description,
  },
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
      <div v-if="isLoading || !course" class="space-y-2"> 
        <Skeleton class="h-[22px] w-full" />
        <Skeleton class="h-[22px] w-[70%]" />
        <Skeleton class="h-[22px] w-[80%]" />
      </div>
      <div v-else>
        <h1 class="font-semibold">Qisqacha malumot:</h1>
        <p class="font-normal dark:text-gray-400 max-h-[400px] overflow-y-auto mb-2">{{ props.course?.description }}</p>
      </div>
    </div>
    <div v-else>
      <form @submit.prevent="onSubmit">
        <div class="space-y-3">
          <FormField v-slot="{ field, errors }" name="description">
            <FormItem>
              <FormControl>
                <FormLabel>Qisqacha malumot <span class="text-red-500">*</span></FormLabel>
                <Textarea type="text" :default-value="props.course?.description" v-model="field.value" v-bind="field" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="flex">
            <Button  type="submit">
              <template v-if="!isLoading">
                Saqlash
              </template>
              <template v-else>
                <Loader class="animate-spin" /> Yuborilmoqda...
              </template>
            </Button>
          </div>
        </div>
      </form>
    </div>
</template>