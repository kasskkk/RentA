import { useQuery, useQueryClient } from "@tanstack/react-query"
import agent from "../api/agent"
import type { Profile, User } from "../types"
import { useMemo } from "react";

export const useProfile = (id?: string) => {
    const queryClient = useQueryClient();

    const { data: profile, isLoading } = useQuery<Profile>({
        queryKey: ['profile', id],
        queryFn: async () => {
            const respone = await agent.get<Profile>(`/profiles/${id}`)
            return respone.data
        },
        enabled: !!id
    })

    const isCurrentUser = useMemo(() => {
        return id === queryClient.getQueryData<User>(['user'])?.id
    }, [id, queryClient])
    return {
        profile,
        isLoading,
        isCurrentUser
    }
}
