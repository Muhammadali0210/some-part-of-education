import { ApiService } from "@/services/apiServices";
import type { Course } from "@/types";
import { ref } from 'vue'

function useGetAllCourse(){
    const isLoading = ref<boolean>(false);
    const data = ref();
    const getAllCourse = async () => {
        try {
          isLoading.value = true;
          const res: Course = await ApiService.getByIdToken(`/course`);
          data.value = res;
        } catch (error) {
          console.log(error);
        } finally {
          isLoading.value = false;
        }
    }
    return { isLoading, data, getAllCourse }
}

export default useGetAllCourse;