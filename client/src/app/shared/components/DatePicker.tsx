import ReactDatePicker from "react-datepicker"; // alias
import "react-datepicker/dist/react-datepicker.css";
import { enUS } from "date-fns/locale";
import { useController, type FieldValues, type UseControllerProps } from "react-hook-form";

type Props<T extends FieldValues> = {
    lablel: string;
    showTime?: boolean
} & UseControllerProps<T>;


export default function DatePicker<T extends FieldValues>(props: Props<T>) {
    const { field, fieldState } = useController({ ...props });

    return (
        <div className="flex flex-col gap-1 w-full max-w-xs">
            <label className="label">{props.lablel}</label>

            <ReactDatePicker
                selected={field.value ?? null}
                onChange={(date) => field.onChange(date)}
                showTimeSelect={props.showTime}
                dateFormat={props.showTime ? "Pp" : "P"}
                locale={enUS}
                customInput={
                    <input
                        className={`input input-bordered w-full ${fieldState.error ? "input-error" : ""
                            }`}
                    />
                }
            />

            {fieldState.error && (
                <p className="text-red-500 text-sm">{fieldState.error.message}</p>
            )}
        </div>
    );
}
