import React from 'react';

const Skeleton = ({ className, width, height, borderRadius = '0.75rem' }) => {
    return (
        <div
            className={`animate-pulse bg-slate-200 ${className}`}
            style={{
                width: width || '100%',
                height: height || '20px',
                borderRadius
            }}
        />
    );
};

export const CardSkeleton = () => (
    <div className="glass p-6 rounded-3xl h-[200px] flex flex-col gap-4">
        <div className="flex justify-between items-start">
            <Skeleton width="60%" height="24px" />
            <Skeleton width="40px" height="40px" borderRadius="12px" />
        </div>
        <Skeleton width="100%" height="60px" />
        <div className="mt-auto flex justify-between">
            <Skeleton width="30%" height="20px" />
            <Skeleton width="30%" height="20px" />
        </div>
    </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
    <div className="space-y-4">
        <div className="flex gap-4 mb-6">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} height="40px" />)}
        </div>
        {[...Array(rows)].map((_, i) => (
            <div key={i} className="flex gap-4 py-3 border-b border-slate-100">
                <Skeleton width="20%" height="20px" />
                <Skeleton width="30%" height="20px" />
                <Skeleton width="15%" height="20px" />
                <Skeleton width="15%" height="20px" />
                <Skeleton width="20%" height="20px" />
            </div>
        ))}
    </div>
);

export default Skeleton;
