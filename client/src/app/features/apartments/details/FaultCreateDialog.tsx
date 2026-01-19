import { useState } from "react";
import { useParams } from "react-router";
import type { Device } from "../../../../lib/types";
import toast from "react-hot-toast";
import { useApartments } from "../../../../lib/hooks/useApartments";

interface Props {
    devices: Device[];
    isOpen: boolean;
    onClose: () => void;
}

export default function FaultCreateDialog({ devices, isOpen, onClose }: Props) {
    const { id } = useParams();
    const { createFault } = useApartments(id);

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

        createFault.mutate({
            ...formData,
            dateReported: new Date().toISOString()
        }, {
            onSuccess: () => {
                toast.success("Usterka została zgłoszona");
                setFormData({ title: "", description: "", deviceId: "" });
                onClose();
            },
            onError: () => {
                toast.error("Wystąpił błąd podczas zgłaszania");
            }
        });
    };

    return (
        <div className="modal modal-open bg-black/50">
            <div className="modal-box relative">
                <button
                    onClick={onClose}
                    className="btn btn-sm btn-circle absolute right-2 top-2"
                >✕</button>

                <h3 className="font-bold text-lg mb-4">Zgłoś nową usterkę</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label text-xs uppercase font-bold opacity-60">Urządzenie</label>
                        <select
                            className="select select-bordered w-full"
                            value={formData.deviceId}
                            onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                        >
                            <option value="">Wybierz sprzęt...</option>
                            {devices.map((device) => (
                                <option key={device.id} value={device.id}>
                                    {device.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label text-xs uppercase font-bold opacity-60">Tytuł usterki</label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder="Np. Pralka nie wypompowuje wody"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label text-xs uppercase font-bold opacity-60">Opis</label>
                        <textarea
                            className="textarea textarea-bordered h-24"
                            placeholder="Opisz co się dzieje..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        ></textarea>
                    </div>

                    <div className="modal-action">
                        <button
                            type="submit"
                            className="btn btn-error text-white w-full"
                            disabled={createFault.isPending}
                        >
                            {createFault.isPending && <span className="loading loading-spinner loading-xs"></span>}
                            Zgłoś usterkę
                        </button>
                    </div>
                </form>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    );
}