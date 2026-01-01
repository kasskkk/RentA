import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { useLocation } from "react-router";
import { useAccount } from "./useAccounts";
import type { Apartment } from "../types";

export const useApartments = (id?: string) => {
    const queryClient = useQueryClient();
    const location = useLocation();
    const { currentUser } = useAccount();

    const { data: apartments, isPending } = useQuery({
        queryKey: ['apartments'],
        queryFn: async () => {
            // 👇 ZMIANA: Używamy agent.Apartments.list() zamiast agent.get
            return await agent.Apartments.list();
        },
        enabled: location.pathname === '/apartments' && !!currentUser
    });

    const { data: apartment, isPending: isPendingApartment, refetch } = useQuery({
        queryKey: ['apartments', id],
        queryFn: async () => {
            // 👇 ZMIANA
            return await agent.Apartments.details(id!);
        },
        enabled: !!id && !!currentUser
    })

    const createApartment = useMutation({
        mutationFn: async (apartment: Apartment) => {
            return await agent.Apartments.create(apartment);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['apartments'] })
        }
    })

    const updateApartment = useMutation({
        mutationFn: async (apartment: Apartment) => {
           await agent.Apartments.update(apartment.id, apartment);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['apartments'] })
        }
    })

    const deleteApartment = useMutation({
        mutationFn: async (id: string) => {
            await agent.Apartments.delete(id);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['apartments'] })
        }
    })

    const applyToApartment = useMutation({
        mutationFn: async (id: string) => {
            await agent.Apartments.apply(id);
        },
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ['apartments', id] });
            const prevApartment = queryClient.getQueryData<Apartment>(['apartments', id]);

            queryClient.setQueryData<Apartment>(['apartments', id], (oldApartment: any) => {
                if (!oldApartment || !currentUser) return oldApartment;
                // Optimistic update logic...
                return { ...oldApartment }; // Uproszczone dla czytelności
            });
            return { prevApartment }; 
        },
        onSettled: async (id) => {
            await queryClient.invalidateQueries({ queryKey: ['apartments', id] });
        }
    });

    return {
        apartments,
        isPending,
        updateApartment,
        createApartment,
        deleteApartment,
        apartment,
        isPendingApartment,
        applyToApartment,
        loadApartment: refetch // To jest ważne dla odświeżania!
    }
}