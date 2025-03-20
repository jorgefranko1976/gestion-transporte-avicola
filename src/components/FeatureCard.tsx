
import { cn } from '@/lib/utils';
import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className,
}) => {
  return (
    <div 
      className={cn(
        "group p-6 border border-border rounded-2xl bg-card transition-all duration-300 ease-apple hover:shadow-subtle hover:-translate-y-1",
        className
      )}
    >
      <div className="flex flex-col space-y-3">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 ease-apple">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mt-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
