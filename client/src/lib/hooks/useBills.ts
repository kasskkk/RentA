import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import toast from "react-hot-toast";
import type { Bill, CreateBillFormValues } from "../types";

export const useBills = (apartmentId?: string) => {
    const queryClient = useQueryClient();


    const { data: bills, isPending: isLoadingBills } = useQuery({
        queryKey: ['bills', apartmentId],
        queryFn: async () => {
            if (!apartmentId) return [];

            const response = await agent.get<Bill[]>(`/bills/${apartmentId}`);
            return response.data;
        },
        enabled: !!apartmentId
    });

    const createBill = useMutation({
        mutationFn: async (billData: CreateBillFormValues) => {
            const response = await agent.post('/bills', billData);
            return response.data;
        },
        onSuccess: async () => {
            toast.success("Rachunek został dodany");
            await queryClient.invalidateQueries({
                queryKey: ['bills', apartmentId]
            });
        },
        onError: (error: any) => {
            console.error(error);
            toast.error("Nie udało się dodać rachunku.");
        }
    });

    return {
        bills,
        isLoadingBills,
        createBill
    }
}