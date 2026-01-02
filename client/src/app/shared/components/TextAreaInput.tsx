import { useController, type FieldValues, type UseControllerProps } from "react-hook-form";

type Props<T extends FieldValues> = {
    label: string;
} & UseControllerProps<T>;

export default function TextAreaInput<T extends FieldValues>(props: Props<T>) {
    const { field, fieldState } = useController({
        ...props,
    });

    return (
        <fieldset className="fieldset">
            <legend className="fieldset-legend">{props.label}</legend>

            <textarea
                {...field}
                placeholder="Type here"
                className={`textarea ${fieldState.error ? 'input-error' : ''} ${fieldState.error ? 'placeholder-red-500' : ''}`}
            />

            {fieldState.error && (
                <label className="label">
                    <span className="label-text-alt text-red-500">{fieldState.error.message}</span>
                </label>
            )}
        </fieldset>
    )
}
