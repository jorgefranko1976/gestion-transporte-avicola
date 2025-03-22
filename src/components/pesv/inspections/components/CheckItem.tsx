
import { CheckCircle2, XCircle } from 'lucide-react';

interface CheckItemProps {
  label: string;
  checked: boolean;
}

const CheckItem = ({ label, checked }: CheckItemProps) => (
  <li className="flex items-center gap-2">
    {checked ? (
      <CheckCircle2 className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    )}
    <span className={checked ? "text-green-600" : "text-red-600"}>
      {label}
    </span>
  </li>
);

export default CheckItem;
