import { create } from 'zustand';
import type { Apartment } from '../types';

interface ApartmentFilters {
    keyWord?: string;
    city?: string;
    pricePerMonth?: number;
    rooms?: number;
}

interface ApartmentState {
    apartments: Apartment[];
    filters: ApartmentFilters;
    nextCursor: string | null;

    setApartments: (data: { items: Apartment[], nextCursor: string | null }, append?: boolean) => void;
    setFilter: <K extends keyof ApartmentFilters>(name: K, value: ApartmentFilters[K]) => void;
}

export const useApartmentStore = create<ApartmentState>((set) => ({
    apartments: [],
    nextCursor: null,
    filters: { keyWord: '', city: '' },

    setApartments: (data, append = false) => set((state) => ({
        apartments: append ? [...state.apartments, ...data.items] : data.items,
        nextCursor: data.nextCursor
    })),

    setFilter: (name, value) => set((state) => ({
        filters: { ...state.filters, [name]: value }
    })),
}));