type Props = {
    apartment: Apartment
}

export default function ApartmentDetail({ apartment }: Props) {
    return (
        <div className="card bg-base-100 w-96 shadow-sm">
            <figure>
                <img
                    src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                    alt="Shoes" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{apartment.name}</h2>
                <p>{apartment.description}</p>
                <div className="card-actions justify-end">
                    <button className="btn btn-primary">Back</button>
                    <button className="btn btn-inherit">Edit</button>
                </div>
            </div>
        </div>
    )
}
