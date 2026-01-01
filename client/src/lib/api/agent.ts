import axios, { type AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { router } from "../../app/router/Routes";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

const sleep = (delay: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, delay)
    });
}

axiosInstance.interceptors.response.use(
    async response => {
        if (import.meta.env.DEV) await sleep(1000);
        return response;
    },
    async error => {
        if (import.meta.env.DEV) await sleep(1000);
        const { status, data } = error.response;
        switch (status) {
            case 400:
                if (data.errors) {
                    const modalStateErrors = [];
                    for (const key in data.errors) {
                        if (data.errors[key]) {
                            modalStateErrors.push(data.errors[key]);
                        }
                    }
                    throw modalStateErrors.flat();
                } else {
                    toast.error(data);
                }
                break;
            case 401:
                toast.error('Brak autoryzacji');
                break;
            case 403:
                toast.error('Brak dostępu');
                break;
            case 404:
                router.navigate('/not-found');
                break;
            case 500:
                router.navigate('/server-error', { state: { error: data } })
                break;
            default:
                break;
        }
        return Promise.reject(error);
    }
);

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string) => axiosInstance.get(url).then(responseBody),
    post: (url: string, body: {}) => axiosInstance.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axiosInstance.put(url, body).then(responseBody),
    del: (url: string) => axiosInstance.delete(url).then(responseBody),
}

const Account = {
    // Dostosowałem ścieżki do Twojego starego hooka:
    current: () => requests.get('/account/user-info'), 
    login: (user: any) => requests.post('/login?useCookies=true', user), 
    register: (user: any) => requests.post('/account/register', user),
    // 👇 DODAŁEM LOGOUT:
    logout: () => requests.post('/account/logout', {})
}

const Profiles = {
    get: (username: string) => requests.get(`/profiles/${username}`),
    uploadPhoto: (file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axiosInstance.post('profiles/add-photo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },
    setMainPhoto: (id: string) => requests.post(`/profiles/set-main-photo/${id}`, {}),
    deletePhoto: (id: string) => requests.del(`/profiles/delete-photo/${id}`)
}

const Apartments = {
    list: () => requests.get('/apartments'),
    details: (id: string) => requests.get(`/apartments/${id}`),
    create: (apartment: any) => requests.post('/apartments', apartment),
    update: (id: string, apartment: any) => requests.put(`/apartments/${id}`, apartment),
    delete: (id: string) => requests.del(`/apartments/${id}`),
    apply: (id: string) => requests.post(`/apartments/${id}/apply`, {})
}

const Faults = {
    create: (fault: any) => requests.post('/faults', fault),
    resolve: (id: string) => requests.put(`/faults/${id}/resolve`, {})
}

const agent = {
    Account,
    Profiles,
    Apartments,
    Faults
}

export default agent;