type Props = {
    apartment: Apartment
}

export default function ApartmentCard({ apartment }: Props) {
    return (
        <div className="card bg-base-50 w-auto shadow-sm">
            <figure className="m-0">
                <img
                    src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                    alt="Apartment"
                    className="w-full"
                />
            </figure>
            <div className="card-body p-2">
                <h2 className="card-title text-sm">{apartment.name}</h2>
                <p className="text-xs">{apartment.description}</p>
                <div className="card-actions justify-end">
                    <button className="btn btn-primary btn-sm">Edit</button>
                    <button className="btn btn-primary btn-sm">Details</button>
                </div>
            </div>
        </div>
    )
}
