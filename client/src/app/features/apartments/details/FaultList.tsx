import { useState } from "react";
import type { Device, Fault } from "../../../../lib/types";
import { useApartments } from "../../../../lib/hooks/useApartments";
import { useParams } from "react-router";

interface Props {
    devices: Device[];
    isOwner: boolean;
    onAddClick: () => void;
}

export default function FaultList({ devices, isOwner, onAddClick }: Props) {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const { id } = useParams();
    const { resolveFault } = useApartments(id);
    const allFaults = devices.flatMap(device =>
        device.faults ? device.faults.map(fault => ({ ...fault, deviceName: device.name })) : []
    ).sort((a, b) => new Date(b.dateReported).getTime() - new Date(a.dateReported).getTime());

    const handleResolve = async (faultId: string) => {
        setLoadingId(faultId);
        try {
            await resolveFault.mutateAsync(faultId);
        } finally {
            setLoadingId(null);
        }
    }

    return (
        <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-base-content">Historia zgłoszeń</h3>

                {!isOwner && (
                    <button onClick={onAddClick} className="btn btn-sm btn-error text-white gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Zgłoś usterkę
                    </button>
                )}
            </div>

            {allFaults.length === 0 ? (
                <div className="alert alert-success mt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Brak zgłoszonych usterek. Wszystkie urządzenia działają poprawnie.</span>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {allFaults.map((fault: Fault & { deviceName: string }) => (
                        <div
                            key={fault.id}
                            className={`
                                p-4 rounded-lg border transition-all duration-200
                                ${fault.isResolved
                                    ? 'bg-base-200/30 border-base-200 opacity-60'
                                    : 'bg-base-100 border-error/30 shadow-sm hover:shadow-md'
                                }
                            `}
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">

                                <div className="flex-grow space-y-2">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3 className="font-bold text-lg text-base-content">{fault.title}</h3>
                                        {fault.isResolved ? (
                                            <div className="badge badge-success badge-outline gap-1">Naprawione</div>
                                        ) : (
                                            <div className="badge badge-error text-white gap-1">Do naprawy</div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-base-content/70">
                                        <span className="font-medium">{fault.deviceName}</span>
                                        <span className="text-base-content/30">•</span>
                                        <span>{new Date(fault.dateReported).toLocaleDateString('pl-PL')}</span>
                                    </div>

                                    <p className="text-base-content/90 leading-relaxed pt-1">{fault.description}</p>
                                </div>

                                {isOwner && !fault.isResolved && (
                                    <div className="flex-shrink-0 self-center sm:self-start">
                                        <button
                                            onClick={() => handleResolve(fault.id)}
                                            disabled={loadingId === fault.id}
                                            className="btn btn-sm btn-success text-white no-animation shadow-sm"
                                        >
                                            {loadingId === fault.id ? (
                                                <span className="loading loading-spinner loading-xs"></span>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                            )}
                                            Zatwierdź naprawę
                                        </button>
                                    </div>
                                )}

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}