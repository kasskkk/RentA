import { useController, type FieldValues, type UseControllerProps } from "react-hook-form";

type Props<T extends FieldValues> = {
    label: string;
} & UseControllerProps<T>;

export default function NumberInput<T extends FieldValues>({ label, ...props }: Props<T>) {
    const { field, fieldState } = useController(props);

    return (
        <fieldset className="fieldset">
            <legend className="fieldset-legend">{label}</legend>

            <input
                type="number"
                placeholder="Enter number here"
                className={`input ${fieldState.error ? 'input-error' : ''}`}
                value={field.value ?? 0}
                onChange={e => field.onChange(Number(e.target.value))}
                ref={field.ref}
            />

            {fieldState.error && (
                <label className="label">
                    <span className="label-text-alt text-red-500">{fieldState.error.message}</span>
                </label>
            )}
        </fieldset>
    );
}
