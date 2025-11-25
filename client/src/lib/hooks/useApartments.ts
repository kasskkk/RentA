import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";

export const useApartments = (id?: string) => {
    const queryClient = useQueryClient();

    const { data: apartments, isPending } = useQuery({
        queryKey: ['apartments'],
        queryFn: async () => {
            const response = await agent.get<Apartment[]>('/apartments');
            return response.data;
        }
    });

    const {data: apartment, isPending: isPendingApartment} = useQuery({
        queryKey: ['apartments', id],
        queryFn: async () => {
            const response = await agent.get<Apartment>(`/apartments/${id}`);
            return response.data
        },
        enabled: !!id
    })

    const createApartment = useMutation({
        mutationFn: async (apartment: Apartment) => {
            const respone = await agent.post('/apartments', apartment);
            return respone.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['apartments']
            })
        }
    })

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
        deleteApartment,
        apartment,
        isPendingApartment
    }
}