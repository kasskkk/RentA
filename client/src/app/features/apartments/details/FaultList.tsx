import { useState } from 'react';
import { useParams } from 'react-router';
import { useFaults } from '../../../../lib/hooks/useFaults';
import FaultCreateDialog from './FaultCreateDialog';
import type { Device } from '../../../../lib/types';

interface Props {
    isOwner: boolean; 
    devices: Device[]; 
}

export default function FaultList({ isOwner, devices }: Props) {
    const { id } = useParams();
    const { faults, isLoadingFaults, resolveFault } = useFaults(id);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="animate-fade-in mt-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                   <h3 className="font-bold text-lg">Zgłoszone usterki</h3>
                   <p className="text-sm opacity-70">Zarządzaj awariami w mieszkaniu</p>
                </div>
                <button 
                    className="btn btn-error btn-sm md:btn-md text-white"
                    onClick={() => setIsModalOpen(true)}
                >
                    + Zgłoś usterkę
                </button>
            </div>

            {isLoadingFaults ? (
                <div className="flex justify-center p-8">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : !faults || faults.length === 0 ? (
                <div className="alert bg-base-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>Brak zgłoszonych usterek.</span>
                </div>
            ) : (
                <div className="overflow-x-auto border border-base-200 rounded-lg">
                    <table className="table table-zebra w-full">
                        <thead className="bg-base-200">
                            <tr>
                                <th>Status</th>
                                <th>Urządzenie</th>
                                <th>Problem</th>
                                <th>Zgłoszono</th>
                                <th>Akcje</th>
                            </tr>
                        </thead>
                        <tbody>
                            {faults.map(fault => (
                                <tr key={fault.id}>
                                    <td>
                                        {fault.isResolved 
                                            ? <span className="badge badge-success text-white gap-1">✓ Naprawione</span>
                                            : <span className="badge badge-error text-white gap-1">⚠ Awaria</span>
                                        }
                                    </td>
                                    <td className="font-bold text-sm">{fault.deviceName}</td>
                                    <td>
                                        <div className="font-bold">{fault.title}</div>
                                        {fault.description && <div className="text-xs opacity-70 max-w-xs truncate">{fault.description}</div>}
                                    </td>
                                    <td className="text-sm">{new Date(fault.dateReported).toLocaleDateString('pl-PL')}</td>
                                    <td>
                                        {!fault.isResolved && (
                                            <button 
                                                className="btn btn-xs btn-outline btn-success"
                                                onClick={() => resolveFault.mutate(fault.id)}
                                                disabled={resolveFault.isPending}
                                            >
                                                {resolveFault.isPending ? '...' : 'Naprawione'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <FaultCreateDialog 
                apartmentId={id!} 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                devices={devices}
            />
        </div>
    );
}