import { useState } from 'react';
import Calendar from 'react-calendar';
import './Calendar.css'; 
import { useUserBills } from '../../../lib/hooks/useApartments';
import type { Bill } from '../../../lib/types';
import ApartmentCard from '../apartments/dashboard/ApartmentCard';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function DashboardCalendar() {
    const [value, onChange] = useState<Value>(new Date());
    const { userBills, isPendingUserBills } = useUserBills();

    const getBillsForDate = (date: Date) => {
        if (!userBills) return [];
        return userBills.filter(bill => {
            const billDate = new Date(bill.dueDate);
            return (
                billDate.getDate() === date.getDate() &&
                billDate.getMonth() === date.getMonth() &&
                billDate.getFullYear() === date.getFullYear()
            );
        });
    };

    const tileContent = ({ date, view }: { date: Date, view: string }) => {
        if (view === 'month') {
            const bills = getBillsForDate(date);
            if (bills.length > 0) {
                return (
                    <div className="flex justify-center mt-1">
                        <div className="w-2 h-2 rounded-full bg-error"></div>
                    </div>
                );
            }
        }
        return null;
    };

    const selectedDateBills = value instanceof Date ? getBillsForDate(value) : [];

    return (
        <div className="card bg-base-100 shadow-xl border border-base-300 w-full max-w-md">
            <div className="card-body p-4">
                <h2 className="card-title text-sm opacity-70 mb-2">Twój Kalendarz Płatności</h2>
                
                {isPendingUserBills ? (
                    <div className="flex justify-center p-4">
                        <span className="loading loading-spinner loading-md"></span>
                    </div>
                ) : (
                    <>
                        <Calendar 
                            onChange={onChange} 
                            value={value} 
                            locale="pl-PL" 
                            nextLabel={<span className="text-xl">›</span>}
                            prevLabel={<span className="text-xl">‹</span>}
                            tileContent={tileContent}
                        />
                        
                        <div className="mt-4">
                            <h3 className="text-sm font-medium border-b pb-2 mb-2">
                                {value instanceof Date ? value.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Wybrany zakres'}
                            </h3>
                            
                            {selectedDateBills.length > 0 ? (
                                <div className="space-y-2">
                                    {selectedDateBills.map((bill: Bill) => (
                                        <div key={bill.id} className="flex justify-between items-center text-sm p-2 bg-base-200 rounded-lg">
                                            <div>
                                                <div className="font-bold">{bill.title}</div>
                                                <div className="text-xs opacity-70">Termin: {new Date(bill.dueDate).toLocaleDateString()}</div>
                                            </div>
                                            <div className="font-bold text-primary">
                                                {bill.amount} zł
                                            </div>
                                            
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-xs opacity-50 py-2">
                                    Brak rachunków na ten dzień
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}