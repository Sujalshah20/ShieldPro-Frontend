import React from "react";
import { cn } from "../../lib/utils";

interface BentoCardData {
  title: string;
  description: string;
  icon: React.ElementType;
  className?: string;
  background?: React.ReactNode;
}

interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cards: BentoCardData[];
  columns?: number;
  rowHeight?: string;
}

export const BentoGrid = ({
  cards,
  columns = 3,
  rowHeight = "auto",
  className,
  ...props
}: BentoGridProps) => {
  return (
    <div
      className={cn(
        `grid w-full gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns}`,
        className
      )}
      {...props}
    >
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={cn(
              "relative overflow-hidden rounded-[2rem] p-6 flex flex-col justify-between",
              "h-[14rem]",
              "bg-slate-900/80 backdrop-blur-3xl",
              "border border-white/10",
              "shadow-2xl shadow-slate-900/20",
              "group transition-all duration-500 ease-in-out hover:scale-[1.02] hover:bg-slate-800/80 hover:border-white/20",
              card.className
            )}
          >
            {card.background && (
              <div className="absolute inset-0 z-0 opacity-30 transition-opacity duration-300 group-hover:opacity-50 blur-xl scale-150">
                {card.background}
              </div>
            )}

            {/* Content */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/5 group-hover:bg-white/20 transition-colors">
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>

              <div className="mt-auto">
                <h3 className="text-2xl font-semibold text-white leading-tight mb-1">{card.title}</h3>
                <p className="text-sm font-medium text-white/60">
                  {card.description}
                </p>
              </div>
            </div>

            {/* Subtle inner glow */}
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] border border-white/5 mix-blend-overlay" />
          </div>
        );
      })}
    </div>
  );
};
