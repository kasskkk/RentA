import ApartmentList from "./ApartmentList";

type Props = {
    apartments: Apartment[];
}
export default function ApartmentDashboard({ apartments }: Props) {
    return (
        <>
            <ApartmentList apartments={apartments} />
        </>
    )
}
