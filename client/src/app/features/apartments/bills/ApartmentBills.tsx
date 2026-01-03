import { useEffect, useState } from 'react';
import agent from '../../../../lib/api/agent';
import type { Bill } from '../../../../lib/types';
import BillForm from './BillForm';
import { useParams } from 'react-router';

interface Props {
    isOwner: boolean;
}

export default function ApartmentBills({ isOwner }: Props) {
    const { id } = useParams();
    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (id) loadBills();
    }, [id]);

    function loadBills() {
        if (!id) return;
        setLoading(true);

        // Zmieniamy z agent.Bills.list(id) na bezpośredni get
        agent.get(`/apartments/${id}/bills`)
            .then((response: any) => {
                // Sprawdź czy dane są w response.data (zależy od Twojego agenta)
                const data = response.data || response;
                setBills(data);
            })
            .catch(error => console.error("Błąd ładowania rachunków:", error))
            .finally(() => setLoading(false));
    }

    const formatDate = (date: string) => new Date(date).toLocaleDateString('pl-PL');
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(amount);

    return (
        <div className="animate-fade-in mt-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-lg">Historia płatności</h3>
                    <p className="text-sm opacity-70">Zarządzaj rachunkami i opłatami</p>
                </div>
                {isOwner && (
                    <button
                        className="btn btn-primary btn-sm md:btn-md"
                        onClick={() => setIsModalOpen(true)}
                    >
                        + Dodaj Rachunek
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center p-8">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : bills.length === 0 ? (
                <div className="alert bg-base-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>Brak rachunków dla tego apartamentu.</span>
                </div>
            ) : (
                <div className="overflow-x-auto border border-base-200 rounded-lg">
                    <table className="table table-zebra w-full">
                        <thead className="bg-base-200">
                            <tr>
                                <th>Tytuł</th>
                                <th>Termin płatności</th>
                                <th>Kwota</th>
                                <th className="hidden md:table-cell">Opis</th>
                                {/* Usunięto kolumnę Okres */}
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map((bill) => {
                                const isOverdue = new Date(bill.dueDate) < new Date();
                                return (
                                    <tr key={bill.id} className="hover">
                                        <td className="font-bold">{bill.title}</td>
                                        <td className={isOverdue ? 'text-error font-bold' : ''}>
                                            {formatDate(bill.dueDate)}
                                            {isOverdue && <span className="ml-2 text-xs badge badge-error badge-outline">Po terminie</span>}
                                        </td>
                                        <td className="font-bold text-primary whitespace-nowrap">
                                            {formatCurrency(bill.amount)}
                                        </td>
                                        <td className="hidden md:table-cell text-sm opacity-70 max-w-xs truncate">
                                            {bill.description || '-'}
                                        </td>
                                        {/* Usunięto komórkę Okres */}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <BillForm
                    apartmentId={id!}
                    closeModal={() => setIsModalOpen(false)}
                    refreshBills={loadBills}
                />
            )}
        </div>
    );
}