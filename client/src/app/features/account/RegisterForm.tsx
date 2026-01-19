import { useForm } from "react-hook-form";
import { useAccount } from "../../../lib/hooks/useAccounts";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavLink } from "react-router";
import { registerSchema, type RegisterSchema } from "../../../lib/schemas/registerSchema";

export default function RegisterForm() {
    const { registerUser } = useAccount();

    const { register, handleSubmit, setError, formState: { errors, isValid, isSubmitting } } = useForm<RegisterSchema>({
        mode: 'onTouched',
        resolver: zodResolver(registerSchema),
        defaultValues: {
            isOwner: false
        }
    });

    const onSubmit = async (data: RegisterSchema) => {
        await registerUser.mutateAsync(data, {
            onError: (error) => {
                if (Array.isArray(error)) {
                    error.forEach(err => {
                        if (err.includes('Email')) setError('email', { message: err })
                        else if (err.includes('Password')) setError('password', { message: err })
                    })
                }
            }
        });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-base-100">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-base-200 border-base-300 rounded-box w-xs border p-4">

                <fieldset className="mb-4">
                    <div className="flex gap-2">
                        <div>
                            <label className="label">First name</label>
                            <input
                                {...register("firstName")}
                                type="text"
                                className={`input w-full ${errors.firstName ? 'input-error' : ''}`}
                                placeholder="FirstName"
                            />
                            {errors.firstName && <p className="text-error text-sm mt-1">{errors.firstName.message}</p>}
                        </div>
                        <div>
                            <label className="label">Last name</label>
                            <input
                                {...register("lastName")}
                                type="text"
                                className={`input w-full ${errors.lastName ? 'input-error' : ''}`}
                                placeholder="LastName"
                            />
                            {errors.lastName && <p className="text-error text-sm mt-1">{errors.lastName.message}</p>}
                        </div>
                    </div>
                </fieldset>

                <fieldset className="mb-4">
                    <label className="label">Display name</label>
                    <input
                        {...register("displayName")}
                        type="text"
                        className={`input w-full ${errors.displayName ? 'input-error' : ''}`}
                        placeholder="Nickname"
                    />
                    {errors.displayName && <p className="text-error text-sm mt-1">{errors.displayName.message}</p>}
                </fieldset>

                <fieldset className="mb-4">
                    <label className="label">Phone number</label>
                    <input
                        {...register("phoneNumber")}
                        type="text"
                        className={`input w-full ${errors.phoneNumber ? 'input-error' : ''}`}
                        placeholder="Phone number"
                    />
                    {errors.phoneNumber && <p className="text-error text-sm mt-1">{errors.phoneNumber.message}</p>}
                </fieldset>

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

                <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-full border p-4">
                    <legend className="fieldset-legend">Account type</legend>
                    <label className="label">
                        <input
                            {...register("isOwner")}
                            type="checkbox"
                            className="checkbox"
                        />
                        I want to rent apartments to others
                    </label>
                </fieldset>

                <button
                    className="btn btn-neutral w-full mt-2"
                    type="submit"
                    disabled={!isValid || isSubmitting}
                >
                    Register
                </button>

                <NavLink to="/login" className="btn w-full mt-2">Back to login</NavLink>
            </form>
        </div>
    );
}
