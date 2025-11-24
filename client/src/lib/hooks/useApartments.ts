import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";

export const useApartments = () => {
    const queryClient = useQueryClient();

    const { data: apartments, isPending } = useQuery({
        queryKey: ['apartments'],
        queryFn: async () => {
            const response = await agent.get<Apartment[]>('/apartments');
            return response.data;
        }
    });

    const updateApartment = useMutation({
        mutationFn: async (apartment: Apartment) => {
            await agent.put('/apartments', apartment)
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['apartments']
            })
        }
    })

    const createApartment = useMutation({
        mutationFn: async (apartment: Apartment) => {
            await agent.post('/apartments', apartment)
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['apartments']
            })
        }
    })

    const deleteApartment = useMutation({
        mutationFn: async (id: string) => {
            await agent.delete(`/apartments/${id}`)
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['apartments']
            })
        }
    })

    return {
        apartments,
        isPending,
        updateApartment,
        createApartment,
        deleteApartment
    }
}