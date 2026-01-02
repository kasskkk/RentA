import  { useController, type FieldValues, type UseControllerProps } from "react-hook-form";

type Props<T extends FieldValues> = {
    label: string;
    readOnly?: boolean;
    className?: string;
} & UseControllerProps<T>;

export default function GeneratedTextInput<T extends FieldValues>(props: Props<T>) {
    const { field } = useController({
        ...props,
    });

    return (
        <fieldset className="fieldset">
            <legend className="fieldset-legend">{props.label}</legend>

            <input
                {...field}
                readOnly={props.readOnly}
                type="text"
                className={`input ${props.className}`}
            />

        </fieldset>
    )
}
