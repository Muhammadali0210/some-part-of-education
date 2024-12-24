import axios from "axios"
const BaseUrl:string = import.meta.env.VITE_API_URL

// axios.interceptors.response.use(
//     response => {
//         localStorage.setItem('status', response.status.toString());
//         return response;
//     },
//     error => {
//         localStorage.setItem('status', error.response.status.toString());
//         return Promise.reject(error);
//     }
// );

const handleError = (error:any) => {
    // console.error('API Error:', error.response?.data || error.message);
    throw error;
};

export  class ApiService {
    static async get<T>(url: string) {
        try {
            const response = await axios.get(BaseUrl + url)
            return response.data
        } catch (error) {
            handleError(error);
        }
    }

    static async getByIdToken<T>(url: string) {
        try {
            const response = await axios.get(BaseUrl + url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            return response.data
        } catch (error) {
            handleError(error);
        }
    }

    static async getByPagination<T>(url: string, page: number, size: number) {
        try {
            const response = await axios.get(BaseUrl + url, { 
                params: {
                    page: page,
                    size: size
                }
             })
            return response.data
        } catch (error) {
            handleError(error);
        }
    }

    static async getByPaginationToken<T>(url: string, page: number, size: number, token: string) {
        try {
            const response = await axios.get(BaseUrl + url, { 
                params: {
                    page: page,
                    size: size
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
             })
            return response.data
        } catch (error) {
            handleError(error);
        }
    }

    static async post<T>(url: string, data: any) {
        try {
            const response = await axios.post(BaseUrl + url, data)
            return response.data
        } catch (error) {
            handleError(error);
        }
    }

    static async postByToken<T>(url: string, data: any) {
        try {
            const response = await axios.post(BaseUrl + url, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            return response.data
        } catch (error) {
            handleError(error);
        }
    }

    static async postFileByToken<T>(url: string, data: any) {
        try {
            const response = await axios.post(BaseUrl + url, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            return response.data
        } catch (error) {
            handleError(error);
        }
    }

    static async patchByToken<T>(url: string, data: any) {
        try {
            const res = await axios.patch(BaseUrl + url, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            return res.data
        } catch (error) {
            handleError(error);
        }
    }

    static async put<T>(url: string, data: any) {
        try {
            const response = await axios.put(BaseUrl + url, data)
            return response.data
        } catch (error) {
            handleError(error);
        }
    }

    static async updateByIdToken<T>(url: string, data: any, token: string) {
        try {
            const response = await axios.put(BaseUrl + url, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            return response.data
        } catch (error) {
            handleError(error);
        }
    }

    static async delete<T>(url: string) {
        try {
            const response = await axios.delete(BaseUrl + url)
            return response.data
        } catch (error) {
            handleError(error);
        }
    }

    static async deleteByToken<T>(url: string, token: string) {
        try {
            const response = await axios.delete(BaseUrl + url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            return response.data
        } catch (error) {
            handleError(error);
        }
    }

    static async deleteByTokenParams<T>(url: string, token: string, dmtt_id: number) {
        try {
            const response = await axios.delete(BaseUrl + url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                params: {
                    dmtt_id: dmtt_id
                }
            })
            return response.data
        } catch (error) {
            handleError(error);
        }
    }
} 