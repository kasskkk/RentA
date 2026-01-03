import { useState, useEffect } from "react";
import { useBills } from "../../../../lib/hooks/useBills";
import type { CreateBillFormValues } from "../../../../lib/types";

interface Props {
    apartmentId: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function BillCreateDialog({ apartmentId, isOpen, onClose }: Props) {
    const { createBill } = useBills();

    const [formData, setFormData] = useState<Omit<CreateBillFormValues, 'apartmentId'>>({
        title: "",
        amount: 0,
        dueDate: "",
        description: ""
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                title: "",
                amount: 0,
                dueDate: "",
                description: ""
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        createBill.mutate({
            ...formData,
            apartmentId
        }, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    return (
        <div className="modal modal-open bg-black/50">
            <div className="modal-box relative">
                <button onClick={onClose} className="btn btn-sm btn-circle absolute right-2 top-2">✕</button>

                <h3 className="font-bold text-lg mb-4">Dodaj nową opłatę</h3>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <div className="form-control">
                        <label className="label"><span className="label-text font-semibold">Tytuł opłaty</span></label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder="np. Czynsz za Grudzień"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="form-control w-1/2">
                            <label className="label"><span className="label-text font-semibold">Kwota (PLN)</span></label>
                            <input
                                type="number"
                                step="0.01"
                                className="input input-bordered w-full"
                                placeholder="0.00"
                                value={formData.amount || ''}
                                onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                                required
                            />
                        </div>

                        <div className="form-control w-1/2">
                            <label className="label"><span className="label-text font-semibold">Termin płatności</span></label>
                            <input
                                type="date"
                                className="input input-bordered w-full"
                                value={formData.dueDate}
                                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text font-semibold">Opis (opcjonalnie)</span></label>
                        <textarea
                            className="textarea textarea-bordered h-24 resize-none"
                            placeholder="Dodatkowe informacje..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="modal-action mt-6">
                        <button type="button" className="btn" onClick={onClose} disabled={createBill.isPending}>Anuluj</button>
                        <button type="submit" className="btn btn-primary" disabled={createBill.isPending}>
                            {createBill.isPending && <span className="loading loading-spinner loading-xs"></span>}
                            Dodaj opłatę
                        </button>
                    </div>
                </form>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    );
}