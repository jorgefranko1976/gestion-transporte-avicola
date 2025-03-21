
interface QuickNavCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  className?: string;
}

export const QuickNavCard = ({
  icon,
  title,
  description,
  onClick,
  className = "",
}: QuickNavCardProps) => (
  <div
    onClick={onClick}
    className={`group p-6 border border-border rounded-2xl bg-card transition-all duration-300 ease-apple hover:shadow-subtle hover:-translate-y-1 flex gap-4 cursor-pointer ${className}`}
  >
    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 ease-apple flex-shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  </div>
);

export default QuickNavCard;
