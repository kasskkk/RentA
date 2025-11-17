import ApartmentList from "./ApartmentList";

type Props = {
    apartments: Apartment[];
}
export default function ApartmentDashboard({ apartments }: Props) {
    return (
        <ul>
            <ApartmentList apartments={apartments} />
        </ul>
    )
}
