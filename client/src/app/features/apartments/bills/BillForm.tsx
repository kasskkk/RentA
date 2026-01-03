import { useState, useEffect } from 'react';
import type { CreateBillFormValues } from '../../../../lib/types';
import { useBills } from '../../../../lib/hooks/useBills';

interface Props {
    apartmentId: string;
    closeModal: () => void;
}

export default function BillForm({ apartmentId, closeModal }: Props) {
    const { createBill } = useBills(apartmentId);
    const [formData, setFormData] = useState<Omit<CreateBillFormValues, 'apartmentId'>>({
        title: '',
        description: '',
        amount: 0,
        dueDate: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createBill.mutate({
            ...formData,
            apartmentId
        }, {
            onSuccess: () => {
                closeModal();
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
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal} type="button">✕</button>
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
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
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
                        <button type="button" className="btn" onClick={closeModal} disabled={createBill.isPending}>
                            Anuluj
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={createBill.isPending}>
                            {createBill.isPending ? <span className="loading loading-spinner"></span> : 'Zapisz'}
                        </button>
                    </div>
                </form>
            </div>
            <div className="modal-backdrop" onClick={closeModal}></div>
        </dialog>
    );
}