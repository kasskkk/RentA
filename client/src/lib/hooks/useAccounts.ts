import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { LoginSchema } from "../schemas/loginSchema"
import agent from "../api/agent"
import { useLocation, useNavigate } from "react-router"; // Dodałem useLocation
import type { RegisterSchema } from "../schemas/registerSchema";
import toast from "react-hot-toast";

export const useAccount = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation(); // Potrzebne do 'enabled' w useQuery

    const loginUser = useMutation({
        mutationFn: async (creds: LoginSchema) => {
            // 👇 ZMIANA: Używamy metody z agenta
            // Metoda login w agent.ts teraz robi POST na /login?useCookies=true
            await agent.Account.login(creds); 
            
            // Pobieramy dane użytkownika
            return await agent.Account.current();
        },
        onSuccess: async (user) => {
            // Możemy od razu ustawić dane, żeby nie pobierać ich ponownie
            queryClient.setQueryData(['user'], user);
            
            await queryClient.invalidateQueries({
                queryKey: ['user']
            })
            await navigate('/')
        }
    })

    const logoutUser = useMutation({
        mutationFn: async () => {
            // 👇 ZMIANA: Używamy nowej metody logout
            await agent.Account.logout();
        },
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['user'] })
            queryClient.removeQueries({ queryKey: ['apartments'] })
            navigate('/login')
        },
        onError: (err) => console.log('logout error', err)
    })

    const registerUser = useMutation({
        mutationFn: async (creds: RegisterSchema) => {
            // 👇 ZMIANA: Używamy metody z agenta
            await agent.Account.register(creds);
        },
        onSuccess: () => {
            toast.success('Register successfull - lets log in');
            navigate('/login');
        }
    })

    const { data: currentUser, isLoading: loadingUserIfno } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            // 👇 ZMIANA: Używamy metody z agenta
            return await agent.Account.current();
        },
        enabled: !queryClient.getQueryData(['user'])
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