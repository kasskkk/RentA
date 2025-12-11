import { useState } from "react";
import { useController, type FieldValues, type UseControllerProps } from "react-hook-form";
import { type LocationIQSuggestion } from "../../../lib/types";
import { useDebounce } from "react-use";
import axios from "axios";

type Props<T extends FieldValues> = {
    label: string;
    onSelect?: (s: LocationIQSuggestion) => void;
} & UseControllerProps<T>;

export default function LocationInput<T extends FieldValues>(props: Props<T>) {
    const { field, fieldState } = useController({ ...props });
    const [suggestions, setSuggestions] = useState<LocationIQSuggestion[]>([]);
    const [query, setQuery] = useState("");

    const locationUrl = 'https://api.locationiq.com/v1/autocomplete?key=pk.12f43ca8a433c0b517449481e01261a1&limit=5&dedupe=1&'


    useDebounce(
        () => {
            const fetch = async () => {
                if (!query || query.length < 3) {
                    setSuggestions([]);
                    return;
                }

                try {
                    const res = await axios.get(`${locationUrl}q=${query}`);
                    setSuggestions(res.data);
                } catch (error) {
                    console.log(error);
                }
            };

            fetch();
        },
        500,
        [query]
    );

    const handleChange = (value: string) => {
        field.onChange(value);
        setQuery(value);
    };

    const handleSelectSuggestion = (s: LocationIQSuggestion) => {
        field.onChange(s.display_name); // input = string
        setSuggestions([]);
        setQuery("");

        if (props.onSelect) props.onSelect(s);   // <-- przekazuje pełny obiekt w górę
    };

    return (
        <div className="relative flex flex-col gap-1 w-full max-w-xs">
            <label>{props.label}</label>

            <input
                className={`input ${fieldState.error ? 'input-error' : ''} ${fieldState.error ? 'placeholder-red-500' : ''}`}
                value={field.value ?? ""}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Type here"
            />

            {fieldState.error && (
                <label className="label">
                    <span className="label-text-alt text-red-500">{fieldState.error.message}</span>
                </label>
            )}
            {suggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 mt-1 bg-base-100 shadow border rounded max-h-60 overflow-auto z-20">
                    {suggestions.map((s: LocationIQSuggestion) => (
                        <li
                            key={s.place_id}
                            className="p-2 cursor-pointer hover:bg-base-200"
                            onClick={() => handleSelectSuggestion(s)}
                        >
                            {s.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
