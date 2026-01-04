import { useState } from 'react';
import Calendar from 'react-calendar';
import './Calendar.css'; 

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function DashboardCalendar() {
    const [value, onChange] = useState<Value>(new Date());

    return (
        <div className="card bg-base-100 shadow-xl border border-base-300 w-full max-w-md">
            <div className="card-body p-4">
                <h2 className="card-title text-sm opacity-70 mb-2">Twój Kalendarz</h2>
                <Calendar 
                    onChange={onChange} 
                    value={value} 
                    locale="pl-PL" 
                    nextLabel={<span className="text-xl">›</span>}
                    prevLabel={<span className="text-xl">‹</span>}
                />
                
                <div className="mt-4 text-center text-sm font-medium">
                    Wybrano: {value instanceof Date ? value.toLocaleDateString('pl-PL') : 'Zakres'}
                </div>
            </div>
        </div>
    );
}