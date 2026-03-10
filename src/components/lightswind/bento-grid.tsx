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
              "relative overflow-hidden rounded-[2.5rem] p-6 flex flex-col justify-end",
              "h-[16rem]",
              "glass-premium bg-black/5 dark:bg-white/5 backdrop-blur-2xl",
              "border border-black/10 dark:border-white/10",
              "shadow-xl shadow-blue-500/5 dark:shadow-none",
              "group transition-all duration-500 ease-in-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-gold/10 hover:border-gold/30",
              card.className
            )}
          >
            {card.background && (
              <div className="absolute inset-0 z-0 opacity-50 dark:opacity-20 transition-opacity duration-300 group-hover:opacity-70">{card.background}</div>
            )}

            {/* Content */}
            <div className="relative z-10 w-full h-full">
              <div
                className={cn(
                  "flex flex-col justify-end h-full",
                  "transition-all duration-300 ease-out"
                )}
              >
                <div className="bg-background/90 dark:bg-black/40 p-5 rounded-[1.5rem] backdrop-blur-xl border border-border/50 shadow-sm transition-colors group-hover:border-gold/30">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-gold/10 transition-colors">
                    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:text-gold transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground leading-tight">{card.title}</h3>
                  <p className="text-sm font-semibold opacity-60">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Hover overlay effect */}
            <div className="pointer-events-none absolute inset-0 transition-all duration-300 group-hover:bg-black/5 dark:group-hover:bg-white/5 rounded-[2.5rem]" />
          </div>
        );
      })}
    </div>
  );
};
