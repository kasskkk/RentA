import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { LoginSchema } from "../schemas/loginSchema"
import agent from "../api/agent"
import { useNavigate } from "react-router";

export const useAccount = () => {
    const querClient = useQueryClient();
    const navigate = useNavigate();

    const loginUser = useMutation({
        mutationFn: async (creds: LoginSchema) => {
            await agent.post('/login?useCookies=true', creds);
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
            querClient.removeQueries({queryKey: ['user']})
            querClient.removeQueries({queryKey: ['apartments']})
            navigate('/login')
        },
        onError: (err) => console.log('logout error', err)
    })

    const { data: currentUser } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await agent.get<User>('/account/user-info');
            return response.data
        },
        enabled: !querClient.getQueryData(['user'])
    })

    return {
        loginUser,
        currentUser,
        logoutUser
    }
}