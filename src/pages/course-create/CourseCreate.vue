<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import PageContainer from "@/components/PageContainer.vue";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { LoaderIcon, Images } from "lucide-vue-next";
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()
import { ref } from "vue";
import { ApiService } from "@/services/apiServices";
import { useRouter } from "vue-router";

const router = useRouter();

const formSchema = toTypedSchema(
  z.object({
    title: z.string().max(50, { message: "Kurs nomi 50 ta belgidan oshmasligi kerak" }),
    description: z.string().max(50, { message: "Kurs haqidagi malumot 50 ta belgidan oshmasligi kerak" }),
    learning: z.string(),
    requirements: z.string(),
    level: z.string(),
    category: z.string(),
    language: z.string(),
    oldPrice: z.number().min(0),
    currentPrice: z.number().min(0),
  })
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema
});

const uploadedUrl = ref('');
const previewImageUrl = ref('');
const isOpen = ref(false)
const isUploaded = ref(false)
const fileInput = ref<any>(null)
const isSubmiting = ref(false)

const onOpenChange = (value: boolean) => {
  isOpen.value = value
}

const onFileChange = async () => {
  isUploaded.value = false
  uploadedUrl.value = URL.createObjectURL(fileInput.value.files[0]);
};

const  uploadFile = async () => {
  try {
    isUploaded.value = true
    const formData = new FormData();
    formData.append("file", fileInput.value.files[0]);
    const response = await ApiService.postFileByToken("/upload/videoimg", formData);

    if (!response) throw new Error("Rasm yuklashda xato")
    previewImageUrl.value = response.url
    toast({
      title: 'Rasm muvaffaqiyatli yuklandi',
      duration: 2000,
      variant: 'success'
    });
    isUploaded.value = false
  } catch (error) {
      isUploaded.value = false
      toast({
        variant: 'destructive',
        title: 'Rasm yuklashda xato',
        duration: 2000,
      })
      console.error(error);
  }
}

const onSubmit = handleSubmit(async (values) => {
  try {
    isSubmiting.value = true
    await uploadFile()
    const previewImage = previewImageUrl.value
    const data = {
      ...values,
      previewImage,
      published: false
    }
    const res = await ApiService.postByToken("/course/create", data)
    resetForm()
    if (!res) throw new Error("Kurs yaratishda xato")
    toast({
      title: 'Kurs muvaffaqiyatli yaratildi',
      duration: 2000,
      variant: 'success'
    });
    router.push('/instructor-courses')
    isSubmiting.value = false
  } catch (error) {
    isSubmiting.value = false
    toast({
      variant: 'destructive',
      title: 'Kurs yaratishda xato',
      duration: 2000,
    })
    console.log(error);
  }
});
</script>

<template>
  <PageContainer title="Yangi kurs yaratish" subtitle="Kurs yaratish uchun ma'lumotlarni kiriting.">
      <form @submit.prevent="onSubmit">
        <div class="space-y-3">
          <FormField v-slot="{ field, errors }" name="title">
            <FormItem>
              <FormLabel>Kurs nomi <span class="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="text" placeholder="Kurs nomini kiriting" v-bind="field" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ field, errors }" name="description" class="h-[200px]">
            <FormItem>
              <FormLabel>Qisqacha malumot <span class="text-red-500">*</span></FormLabel>
              <FormControl>
                <Textarea v-bind="field" placeholder="Kurs haqida qisqacha malumot" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="grid grid-cols-2 gap-4 max-md:grid-cols-1">
            <FormField v-slot="{ field, errors }" name="learning">
              <FormItem>
                <FormLabel
                  >Sizning kursingizda nimalarni o'rganadi?
                  <span class="text-red-500">*</span></FormLabel
                >
                <FormControl>
                  <Textarea v-bind="field" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ field, errors }" name="requirements">
              <FormItem>
                <FormLabel>Talablar <span class="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Textarea v-bind="field" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="grid grid-cols-3 gap-4 max-sm:grid-cols-1">
            <FormField v-slot="{ field, errors }" name="level">
              <FormItem>
                <FormLabel>Darajasi <span class="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Select v-bind="field">
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
                <FormLabel>Kategoriya<span class="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Select v-bind="field">
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
                <FormLabel>Til<span class="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Select v-bind="field">
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

            <FormField v-slot="{ field, errors }" name="oldPrice">
              <FormItem>
                <FormLabel>Eski narx <span class="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Kurs eski narxini kiriting"
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
                    v-bind="field"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <div>
              <Label>Rasm yuklang<span class="text-red-500 text-sm mb-6">*</span></Label>
              <input
                  type="file"
                  placeholder="Rasm yuklang"
                  accept="image/*"
                  ref="fileInput"
                  @change="onFileChange"
                  class="block w-full mt-2 p-1 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 max-sm:grid-cols-1"></div>

          <div class="flex gap-4 justify-end">
            <Button v-if="uploadedUrl" @click="isOpen = true" variant="outline" type="button"> <Images /> Rasm </Button>
            <Button variant="destructive" type="button" @click="resetForm"> Tozalash </Button>
            <Button  type="submit" :disabled="!uploadedUrl">
              <template v-if="!isSubmiting">
                Saqlash
              </template>
              <template v-else>
                <LoaderIcon class="animate-spin" /> Yuborilmoqda...
              </template>
            </Button>
          </div>
        </div>
      </form>

    <Dialog :open="isOpen" @onOpenChange="onOpenChange" >
      <DialogContent class="sm:max-w-[425px] p-3">
        <DialogHeader v-if="uploadedUrl">
          <DialogTitle class="hidden">Yuklangan rasm</DialogTitle>
          <DialogDescription class="hidden">Yuklangan rasm</DialogDescription>
          <img :src="uploadedUrl" class="w-full max-h-[230px]" style="object-fit: cover;" alt="uploaded url">
        </DialogHeader>
        
        <DialogFooter>
          <Button type="button" variant="outline" @click="isOpen = false">
            Oynani yopish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </PageContainer>
</template>
