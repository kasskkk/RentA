import { useForm } from "react-hook-form";
import { useAccount } from "../../../lib/hooks/useAccounts";
import { loginSchema, type LoginSchema } from "../../../lib/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function LoginForm() {
    const { loginUser } = useAccount();

    const { register, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm<LoginSchema>({
        mode: 'onTouched',
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginSchema) => {
        await loginUser.mutateAsync(data);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-base-100">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-base-200 border-base-300 rounded-box w-xs border p-4">

                <fieldset className="mb-4">
                    <label className="label">Email</label>
                    <input
                        {...register("email")}
                        type="email"
                        className={`input w-full ${errors.email ? 'input-error' : ''}`}
                        placeholder="Email"
                    />
                    {errors.email && <p className="text-error text-sm mt-1">{errors.email.message}</p>}
                </fieldset>

                <fieldset className="mb-4">
                    <label className="label">Password</label>
                    <input
                        {...register("password")}
                        type="password"
                        className={`input w-full ${errors.password ? 'input-error' : ''}`}
                        placeholder="Password"
                    />
                    {errors.password && <p className="text-error text-sm mt-1">{errors.password.message}</p>}
                </fieldset>

                <button
                    className="btn btn-neutral w-full mt-2"
                    type="submit"
                    disabled={!isValid || isSubmitting}
                >
                    Login
                </button>
            </form>
        </div>
    );
}
