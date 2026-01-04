import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { useLocation } from "react-router";
import { useAccount } from "./useAccounts";
import type { PagedList, Apartment, Bill } from "../types";
import { useApartmentStore } from "../stores/useApartmentStore";

export const useUserBills = () => {
    const { currentUser } = useAccount();

    const { data: userBills, isPending: isPendingUserBills } = useQuery({
        queryKey: ['userBills'],
        queryFn: async () => {
            const response = await agent.get<Bill[]>('/bills');
            return response.data;
        },
        enabled: !!currentUser
    });

    return {
        userBills,
        isPendingUserBills
    }
}
export const useUserApartments = () => {
    const { currentUser } = useAccount();

    const { data: userApartments, isPending: isPendingUserApartments } = useQuery({
        queryKey: ['userApartments'],
        queryFn: async () => {
            const response = await agent.get<Apartment[]>('/apartments/my');
            return response.data;
        },
        enabled: !!currentUser
    });

    return {
        userApartments,
        isPendingUserApartments
    }
}
export const useApartments = (id?: string) => {
    const queryClient = useQueryClient();
    const location = useLocation();
    const { currentUser } = useAccount();
    const { filters } = useApartmentStore();

    const { data: apartmentsGroups, isPending, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery<PagedList<Apartment, string>>({
        queryKey: ['apartments', filters],
        queryFn: async ({ pageParam = null }) => {
            const response = await agent.get<PagedList<Apartment, string>>('/apartments', {
                params: {
                    cursor: pageParam,
                    pageSize: 6,
                    keyWord: filters.keyWord,
                    city: filters.city,
                    pricePerMonth: filters.pricePerMonth,
                    rooms: filters.rooms
                }
            });
            return response.data;
        },
        initialPageParam: null,
        placeholderData: keepPreviousData,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        // enabled: location.pathname === '/apartments'
        enabled: !!currentUser
    });

    const { data: apartment, isPending: isPendingApartment } = useQuery({
        queryKey: ['apartments', id],
        queryFn: async () => {
            const response = await agent.get<Apartment>(`/apartments/${id}`);
            return response.data
        },
        enabled: !!id
            && !!currentUser
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

    const createFault = useMutation({
        mutationFn: async (newFault: { title: string; description: string; deviceId: string; dateReported: string }) => {
            const response = await agent.post('/faults', newFault);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['apartments', id] });
        }
    });

    const resolveFault = useMutation({
        mutationFn: async (faultId: string) => {
            await agent.put(`/faults/${faultId}/resolve`, {});
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['apartments', id] });
        }
    });

    const { data: bills, isPending: isPendingBills } = useQuery({
        queryKey: ['bills', id],
        queryFn: async () => {
            const response = await agent.get<Bill[]>(`/bills/${id}`);
            return response.data;
        },
        enabled: !!id && !!currentUser
    });

    const createBill = useMutation({
        mutationFn: async (bill: unknown) => {
            const response = await agent.post('/bills', bill);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['bills', id] });
            // Odświeżamy też globalną listę rachunków użytkownika
            await queryClient.invalidateQueries({ queryKey: ['userBills'] });
        }
    });

    const updateApartment = useMutation({
        mutationFn: async (apartment: Apartment) => {
            const response = await agent.put(`/apartments/${apartment.id}`, apartment)
            return response.data;
        },
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ['apartments', variables.id]
            });
            await queryClient.invalidateQueries({
                queryKey: ['apartments']
            });
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

    const updateMemberStatus = useMutation({
        mutationFn: async ({ id, userId, newStatus }: { id: string, userId: string, newStatus: string }) => {
            await agent.put(`/apartments/${id}/members/${userId}`, {
                status: newStatus
            });
        },
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ['apartments', variables.id]
            })
        }
    })

    const applyToApartment = useMutation({
        mutationFn: async (id: string) => {
            await agent.post(`/apartments/${id}/apply`);
        },
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ['apartments', id] });

            const prevApartment = queryClient.getQueryData<Apartment>(['apartments', id]);

            queryClient.setQueryData<Apartment>(['apartments', id], oldApartment => {
                if (!oldApartment || !currentUser) return oldApartment;

                const isMember = oldApartment.apartmentMembers.some(
                    m => m.userId === currentUser.id
                );

                if (isMember) return oldApartment;

                return {
                    ...oldApartment,
                    apartmentMembers: [
                        ...oldApartment.apartmentMembers,
                        {
                            userId: currentUser.id,
                            user: currentUser,
                            isOwner: false,
                            memberStatus: 'Pending',
                            apartmentId: oldApartment.id,
                            createdAt: new Date().toISOString()
                        }
                    ]
                };
            });

            return { prevApartment };
        },
        onSettled: async (id) => {
            await queryClient.invalidateQueries({ queryKey: ['apartments', id] });
        }
    });

    const uploadApartmentPhoto = useMutation({
        mutationFn: async ({ id, file }: { id: string; file: Blob }) => {
            const formData = new FormData();
            formData.append('File', file);

            return await agent.post(`/apartments/${id}/photos`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['apartments', id] });
        }
    });

    return {
        apartments: apartmentsGroups?.pages.flatMap(page => page.items) ?? [],
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        isPending,
        updateApartment,
        createApartment,
        deleteApartment,
        apartment,
        isPendingApartment,
        applyToApartment,
        updateMemberStatus,
        createBill,
        bills,
        isPendingBills,
        createFault,
        resolveFault,
        uploadApartmentPhoto
    }
    
}