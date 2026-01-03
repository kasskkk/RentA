import { useState, useEffect } from "react";
import { useFaults } from "../../../../lib/hooks/useFaults";
import type { Device, CreateFaultFormValues } from "../../../../lib/types";

interface Props {
    apartmentId: string;
    isOpen: boolean;
    onClose: () => void;
    devices: Device[];
}

export default function FaultCreateDialog({ apartmentId, isOpen, onClose, devices }: Props) {
    const { createFault } = useFaults(apartmentId);
    
    const [formData, setFormData] = useState<CreateFaultFormValues>({
        title: "",
        description: "",
        deviceId: ""
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({ title: "", description: "", deviceId: "" });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createFault.mutate(formData, {
            onSuccess: () => onClose()
        });
    };

    return (
        <dialog className="modal modal-open bg-black/50">
            <div className="modal-box">
                <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                <h3 className="font-bold text-lg mb-4">Zgłoś nową usterkę</h3>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="form-control">
                        <label className="label"><span className="label-text font-semibold">Urządzenie</span></label>
                        <select 
                            className="select select-bordered w-full"
                            value={formData.deviceId}
                            onChange={e => setFormData({...formData, deviceId: e.target.value})}
                            required
                        >
                            <option value="" disabled>-- Wybierz co się zepsuło --</option>
                            {devices.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text font-semibold">Tytuł problemu</span></label>
                        <input 
                            type="text" 
                            className="input input-bordered w-full" 
                            placeholder="np. Pralka nie wiruje"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            required
                            maxLength={50}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text font-semibold">Szczegółowy opis</span></label>
                        <textarea 
                            className="textarea textarea-bordered h-24 resize-none" 
                            placeholder="Opisz dokładnie co się dzieje..."
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            maxLength={500}
                        ></textarea>
                    </div>

                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose} disabled={createFault.isPending}>Anuluj</button>
                        <button type="submit" className="btn btn-error text-white" disabled={createFault.isPending}>
                            {createFault.isPending ? <span className="loading loading-spinner"></span> : 'Zgłoś usterkę'}
                        </button>
                    </div>
                </form>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </dialog>
    );
}