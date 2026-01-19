import { useState } from 'react';
import type { CreateBillFormValues } from '../../../../lib/types';
import toast from 'react-hot-toast';
import { useApartments } from '../../../../lib/hooks/useApartments';

interface Props {
    apartmentId: string;
    closeModal: () => void;
}

export default function BillForm({ apartmentId, closeModal }: Props) {
    // Pobieramy mutację bezpośrednio z Twojego hooka
    const { createBill } = useApartments(apartmentId);

    const [formData, setFormData] = useState<Omit<CreateBillFormValues, 'periodStart' | 'periodEnd'>>({
        apartmentId: apartmentId,
        title: '',
        description: '',
        amount: 0,
        dueDate: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload = {
            ...formData,
            amount: Number(formData.amount),
        };

        // Wywołujemy mutację z hooka
        createBill.mutate(payload, {
            onSuccess: () => {
                toast.success('Rachunek dodany pomyślnie');
                closeModal();
                // Nie musisz wywoływać refreshBills(), bo useApartments 
                // ma już w sobie invalidateQueries(['bills', id])
            },
            onError: (error) => {
                console.error(error);
                toast.error('Nie udało się dodać rachunku');
            }
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <dialog id="bill_modal" className="modal modal-open">
            <div className="modal-box w-11/12 max-w-2xl">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>✕</button>
                </form>
                <h3 className="font-bold text-lg mb-4">Dodaj nowy rachunek</h3>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="form-control">
                        <label className="label"><span className="label-text">Tytuł*</span></label>
                        <input
                            type="text" name="title" required
                            placeholder="np. Czynsz styczeń"
                            className="input input-bordered w-full"
                            value={formData.title} onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="form-control w-full md:w-1/2">
                            <label className="label"><span className="label-text">Kwota (PLN)*</span></label>
                            <input
                                type="number" name="amount" step="0.01" required
                                className="input input-bordered w-full"
                                value={formData.amount} onChange={handleChange}
                            />
                        </div>
                        <div className="form-control w-full md:w-1/2">
                            <label className="label"><span className="label-text">Termin płatności*</span></label>
                            <input
                                type="date" name="dueDate" required
                                className="input input-bordered w-full"
                                value={formData.dueDate} onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text">Opis</span></label>
                        <textarea
                            name="description"
                            className="textarea textarea-bordered h-24"
                            placeholder="Dodatkowe informacje..."
                            value={formData.description} onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="modal-action">
                        <button 
                            type="button" 
                            className="btn" 
                            onClick={closeModal} 
                            disabled={createBill.isPending}
                        >
                            Anuluj
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            disabled={createBill.isPending}
                        >
                            {createBill.isPending ? <span className="loading loading-spinner"></span> : 'Zapisz'}
                        </button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={closeModal}>close</button>
            </form>
        </dialog>
    );
}