import { useController, type UseControllerProps, type FieldValues } from "react-hook-form";

type Props<T extends FieldValues> = {
    label: string;
    items: { text: string, value: string }[];
} & UseControllerProps<T>;

export default function SelectInput<T extends FieldValues>(props: Props<T>) {
    const { field, fieldState } = useController({
        ...props,
    });

    return (
        <fieldset className="fieldset">
            <legend className="fieldset-legend">{props.label}</legend>

            <select
                {...field}
                className={`input ${fieldState.error ? 'input-error' : ''} ${fieldState.error ? 'placeholder-red-500' : ''}`}
            >
                <option value="">Chose...</option>
                {props.items.map((i) => (
                    <option key={i.value} value={i.value}>
                        {i.text}
                    </option>
                ))}
            </select>

            {fieldState.error && (
                <label className="label">
                    <span className="label-text-alt text-red-500">{fieldState.error.message}</span>
                </label>
            )}
        </fieldset>
    );
}
