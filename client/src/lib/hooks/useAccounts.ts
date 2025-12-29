import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { LoginSchema } from "../schemas/loginSchema"
import agent from "../api/agent"
import { useNavigate } from "react-router";
import type { RegisterSchema } from "../schemas/registerSchema";
import toast from "react-hot-toast";
import type { User } from "../types";

export const useAccount = () => {
    const querClient = useQueryClient();
    const navigate = useNavigate();

    const loginUser = useMutation({
        mutationFn: async (creds: LoginSchema) => {
            await agent.post('/login?useCookies=true', creds);

            const response = await agent.get<User>("/account/user-info");
            return response.data;
        },
        onSuccess: async () => {
            await querClient.invalidateQueries({
                queryKey: ['user']
            })
            await navigate('/')
        }
    })

    const logoutUser = useMutation({
        mutationFn: async () => {
            await agent.post('/account/logout')
        },
        onSuccess: () => {
            querClient.removeQueries({ queryKey: ['user'] })
            querClient.removeQueries({ queryKey: ['apartments'] })
            navigate('/login')
        },
        onError: (err) => console.log('logout error', err)
    })

    const registerUser = useMutation({
        mutationFn: async (creds: RegisterSchema) => {
            await agent.post('/account/register', creds)
        },
        onSuccess: () => {
            toast.success('Register successfull - lets log in');
            navigate('/login');
        }
    })

    const { data: currentUser, isLoading: loadingUserIfno } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await agent.get<User>('/account/user-info');
            return response.data
        },
        enabled: 
        // true
        !querClient.getQueryData(['user'])
            && location.pathname !== '/login'
            && location.pathname !== '/register'
    })

    return {
        loginUser,
        currentUser,
        logoutUser,
        loadingUserIfno,
        registerUser
    }
}