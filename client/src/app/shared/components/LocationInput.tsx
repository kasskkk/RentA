import { useState, useEffect } from "react";
import { useController, type FieldValues, type UseControllerProps } from "react-hook-form";
import { type Apartment, type LocationIQSuggestion } from "../../../lib/types";
import { useDebounce } from "react-use";
import axios from "axios";

type Props<T extends FieldValues> = {
    label: string;
} & UseControllerProps<T>;

export default function LocationInput<T extends FieldValues>({ label, ...props }: Props<T>) {
    const { field, fieldState } = useController(props);
    const [inputValue, setInputValue] = useState(typeof field.value === "string" ? field.value : '');
    const [suggestions, setSuggestions] = useState<LocationIQSuggestion[]>([]);
    const key = import.meta.env.VITE_LOCATIONIQ_KEY;

    const locationUrl =
        `https://api.locationiq.com/v1/autocomplete?key=${key}&limit=5&dedupe=1&`;

    // Debounced query
    const [debouncedQuery, setDebouncedQuery] = useState(inputValue);
    useDebounce(
        () => {
            if (!debouncedQuery || debouncedQuery.length < 3) {
                setSuggestions([]);
                return;
            }
            fetchSuggestions(debouncedQuery);
        },
        500,
        [debouncedQuery]
    );

    const fetchSuggestions = async (query: string) => {
        try {
            const res = await axios.get<LocationIQSuggestion[]>(`${locationUrl}q=${encodeURIComponent(query)}`);
            setSuggestions(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (value: string) => {
        setInputValue(value);
        setDebouncedQuery(value);
        field.onChange(value);
    };

    const handleSelect = (location: LocationIQSuggestion) => {
        const latitude = parseFloat(location.lat);
        const longitude = parseFloat(location.lon);

        setInputValue(location.display_name);
        field.onChange({ latitude, longitude });
        setSuggestions([]);
    };

    useEffect(() => {
        if (field.value && typeof field.value === "object") {
            if ("city" in field.value) {
                const val = field.value as Apartment;
                setInputValue(`${val.city}${val.buildingNumber ? ` ${val.buildingNumber}` : ""}`);
            }
            else if ("latitude" in field.value && "longitude" in field.value) {
                setInputValue(`${field.value.latitude.toFixed(4)}, ${field.value.longitude.toFixed(4)}`);
            }
        }
    }, [field.value]);

    return (
        <div className="relative flex flex-col gap-1 w-full max-w-xs">
            <label className="font-semibold">{label}</label>

            <input
                type="text"
                className={`input ${fieldState.error ? 'input-error' : ''} ${fieldState.error ? 'placeholder-red-500' : ''}`}
                value={inputValue}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Type city and street..."
                ref={field.ref}
            />

            {fieldState.error && (
                <span className="text-red-500 text-sm">
                    {fieldState.error?.message ||
                        (fieldState.error?.types ? Object.values(fieldState.error.types).join(', ') : null)}
                </span>
            )}

            {suggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 mt-1 bg-base-100 shadow border rounded max-h-60 overflow-auto z-20">
                    {suggestions.map((s) => (
                        <li
                            key={s.place_id}
                            className="p-2 cursor-pointer hover:bg-base-200"
                            onClick={() => handleSelect(s)}
                        >
                            {s.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}