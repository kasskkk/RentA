import ApartmentList from "./ApartmentList";

type Props = {
    apartments: Apartment[];
    selectApartment: (id: string) => void;
    cancelSelectApartment: () => void;
    selectedApartment?: Apartment;
    openForm: (id: string) => void;
    closeForm: () => void;
    editMode: boolean;
}
export default function ApartmentDashboard({ apartments, selectApartment, cancelSelectApartment, selectedApartment, openForm, closeForm, editMode }: Props) {
    return (
        <>
            <ApartmentList apartments={apartments} />
        </>
    )
}
