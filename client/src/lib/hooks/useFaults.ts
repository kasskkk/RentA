import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import toast from "react-hot-toast";
import type { Fault, CreateFaultFormValues } from "../types";

export const useFaults = (apartmentId?: string) => {
    const queryClient = useQueryClient();

    const { data: faults, isPending: isLoadingFaults } = useQuery({
        queryKey: ['faults', apartmentId],
        queryFn: async () => {
            if (!apartmentId) return [];
            const response = await agent.get<Fault[]>(`/faults/${apartmentId}`);
            return response.data;
        },
        enabled: !!apartmentId
    });

    const createFault = useMutation({
        mutationFn: async (faultData: CreateFaultFormValues) => {
            const response = await agent.post('/faults', faultData);
            return response.data;
        },
        onSuccess: async () => {
            toast.success("Zgłoszono usterkę");
            await queryClient.invalidateQueries({ queryKey: ['faults', apartmentId] });
            await queryClient.invalidateQueries({ queryKey: ['apartments', apartmentId] });
        },
        onError: (error: any) => {
            console.error(error);
            toast.error("Nie udało się zgłosić usterki");
        }
    });

    const resolveFault = useMutation({
        mutationFn: async (faultId: string) => {
            await agent.put(`/faults/${faultId}/resolve`, {});
        },
        onSuccess: async () => {
            toast.success("Usterka oznaczona jako naprawiona");
            await queryClient.invalidateQueries({ queryKey: ['faults', apartmentId] });
            await queryClient.invalidateQueries({ queryKey: ['apartments', apartmentId] });
        },
        onError: () => toast.error("Błąd podczas aktualizacji")
    });

    return {
        faults,
        isLoadingFaults,
        createFault,
        resolveFault
    }
}