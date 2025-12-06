import { useController, type UseControllerProps, type FieldValues } from "react-hook-form";

type Props<T extends FieldValues> = {
    label: string;
    defaultValue: string;
} & UseControllerProps<T>;

export default function TextInput<T extends FieldValues>(props: Props<T>) {
    const { field, fieldState } = useController({
        ...props,
    });

    return (
        <fieldset className="fieldset">
            <legend className="fieldset-legend">{props.label}</legend>

            <input
                {...field}
                type="text"
                placeholder="Type here"
                className={`input ${fieldState.error ? 'input-error' : ''} ${fieldState.error ? 'placeholder-red-500' : ''}`}
            />

            {fieldState.error && (
                <label className="label">
                    <span className="label-text-alt text-red-500">{fieldState.error.message}</span>
                </label>
            )}
        </fieldset>
    );
}
