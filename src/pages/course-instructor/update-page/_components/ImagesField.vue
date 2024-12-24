<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-vue-next";
import { useUpdateCourseInfo } from "../service";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiService } from "@/services/apiServices";

// Service funksiyalar
const { isLoading, data, updateCourseInfo } = useUpdateCourseInfo();

const props = defineProps({
  state: Boolean,
  course: Object,
});

const emit = defineEmits<{
  (e: "onUpdated", data: any): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null); // Tip aniq belgilandi
const isUploaded = ref(false);
const uploadedUrl = ref<string>("");

const onFileChange = () => {
  if (!fileInput.value || !fileInput.value.files || fileInput.value.files.length === 0) {
    console.error("Fayl tanlanmagan");
    return;
  }
  isUploaded.value = false;

  const file = fileInput.value.files[0];
  uploadedUrl.value = URL.createObjectURL(file); // Preview uchun URL
  isUploaded.value = true;
};

const uploadFile = async () => {
  if (!fileInput.value || !fileInput.value.files || fileInput.value.files.length === 0) {
    console.error("Fayl tanlanmagan");
    return;
  }
  try {
    isUploaded.value = false;
    if (!fileInput.value) {
      console.error("File input DOM element topilmadi");
      return;
    }
    console.log("ok");
    
    // Faylni FormData ga qo'shish
    const formData = new FormData();
    formData.append("file", fileInput.value.files[0]);

    // API orqali yuklash
    const response = await ApiService.postFileByToken("/upload/videoimg", formData);

    if (!response || !response.url) {
      throw new Error("Rasm yuklashda xato");
    }

    await updateCourseInfo(Number(props.course?._id), {
      previewImage: response.url,
    });

    emit("onUpdated", data.value);
    isUploaded.value = false;
  } catch (error) {
    isUploaded.value = false;
    console.error("Fayl yuklashda xato:", error);
  }
};

onMounted(async () => {
  await nextTick();
  console.log(fileInput.value); // Fayl input DOM element mavjudligini tekshirish
});
</script>

<template>
  <!-- Tashqi rasm preview -->
  <div v-if="!state" class="flex">
    <Skeleton v-if="isLoading || !course" class="h-[250px] max-sm:h-[160px] w-full" />
    <div v-else class="w-full h-[250px] max-sm:h-[160px]">
      <img
        :src="course?.previewImage"
        class="w-full h-full object-cover"
        alt="Kurs image"
      />
    </div>
  </div>

  <!-- Ichki yuklash qismi -->
  <div v-else>
    <div class="space-y-3">
      <!-- Fayl tanlash -->
      <div v-if="!isUploaded">
        <Label>Rasm yuklang<span class="text-red-500 text-sm mb-6">*</span></Label>
        <input
          type="file"
          ref="fileInput"
          accept="image/*"
          @change="onFileChange"
          class="block w-full mt-2 p-1 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        />
      </div>

      <!-- Rasm preview va saqlash -->
      <div v-else class="flex flex-col space-y-3">
        <div class="w-full h-[250px] max-sm:h-[160px]">
          <img :src="uploadedUrl" class="w-full h-full object-cover" alt="Kurs image" />
        </div>
        <Button @click="uploadFile">
          <template v-if="!isLoading">Saqlash</template>
          <template v-else><Loader class="animate-spin" /> Yuborilmoqda...</template>
        </Button>
      </div>
    </div>
  </div>
</template>
