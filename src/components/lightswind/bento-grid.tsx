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
              "relative overflow-hidden rounded-3xl p-6 flex flex-col justify-end",
              "h-[16rem]",
              "bg-white/60 dark:bg-white/5 backdrop-blur-md",
              "border border-white/60 dark:border-white/10",
              "shadow-sm shadow-slate-200/50 dark:shadow-inner dark:shadow-white/5",
              "text-black dark:text-white",
              "group transition-all duration-300 ease-in-out",
              card.className
            )}
          >
            {card.background && (
              <div className="absolute inset-0 z-0">{card.background}</div>
            )}

            {/* Content */}
            <div className="relative z-10 w-full h-full">
              <div
                className={cn(
                  "flex flex-col justify-end h-full",
                  "transition-all duration-300 ease-out"
                )}
              >
                <div className="bg-white/80 dark:bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/50 dark:border-white/10 shadow-sm">
                  <Icon className="h-7 w-7 text-blue-600 dark:text-blue-500 mb-3" />
                  <h3 className="text-xl font-bold text-foreground dark:text-white leading-tight">{card.title}</h3>
                  <p className="text-sm font-medium text-foreground/60 dark:text-slate-300">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Hover overlay effect */}
            <div className="pointer-events-none absolute inset-0 transition-all duration-300 group-hover:bg-black/5 dark:group-hover:bg-white/5 rounded-2xl" />
          </div>
        );
      })}
    </div>
  );
};
