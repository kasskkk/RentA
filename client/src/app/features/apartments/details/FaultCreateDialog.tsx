import { useState } from "react";
import type { Device } from "../../../../lib/types";
import agent from "../../../../lib/api/agent";
import toast from "react-hot-toast";

interface Props {
    devices: Device[];
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function FaultCreateDialog({ devices, isOpen, onClose, onSuccess }: Props) {
    const [loading, setLoading] = useState(false);
    
    // Stan formularza
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        deviceId: ""
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.deviceId) {
            toast.error("Wybierz urządzenie z listy");
            return;
        }

        setLoading(true);
        try {
            // Wysyłamy żądanie do API
            await agent.Faults.create({
                title: formData.title,
                description: formData.description,
                deviceId: formData.deviceId,
                dateReported: new Date().toISOString()
            });
            
            toast.success("Zgłoszenie zostało wysłane!");
            setFormData({ title: "", description: "", deviceId: "" }); // Reset formularza
            onSuccess(); // Odświeżamy dane w ApartmentDetails
            onClose();   // Zamykamy modal
        } catch (error) {
            console.log(error);
            toast.error("Nie udało się wysłać zgłoszenia");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal modal-open bg-black/50">
            <div className="modal-box relative">
                <button onClick={onClose} className="btn btn-sm btn-circle absolute right-2 top-2">✕</button>
                
                <h3 className="font-bold text-lg mb-4">Zgłoś nową usterkę</h3>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Wybór urządzenia */}
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

                    {/* Tytuł */}
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

                    {/* Opis */}
                    <div className="form-control">
                        <label className="label"><span className="label-text font-semibold">Szczegółowy opis</span></label>
                        <textarea 
                            className="textarea textarea-bordered h-24 resize-none" 
                            placeholder="Opisz dokładnie co się dzieje..."
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            required
                            maxLength={500}
                        ></textarea>
                    </div>

                    <div className="modal-action mt-6">
                        <button type="button" className="btn" onClick={onClose} disabled={loading}>Anuluj</button>
                        <button type="submit" className="btn btn-error text-white" disabled={loading}>
                            {loading && <span className="loading loading-spinner loading-xs"></span>}
                            Zgłoś usterkę
                        </button>
                    </div>
                </form>
            </div>
            {/* Tło zamykające modal po kliknięciu */}
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    );
}