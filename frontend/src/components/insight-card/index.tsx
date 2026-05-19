import type { FC } from 'react';

const InsightCard: FC<{ icon: React.ReactNode; title: string; value: string; color: string }> = ({ icon, title, value, color }) => (
    <div className={`p-4 rounded-xl flex items-center gap-4 bg-white shadow-sm border border-slate-100 dark:bg-zinc-800 dark:border-zinc-700`}>
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-600 dark:text-zinc-400">{title}</p>
            <p className="text-xl font-bold dark:text-white">{value}</p>
        </div>
    </div>
);

export default InsightCard