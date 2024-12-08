import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StatsCardProps {
  stat: {
    name: string;
    value: string;
    icon: LucideIcon;
    link?: string;
  };
}

export default function StatsCard({ stat }: StatsCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (stat.link) {
      navigate(stat.link);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white p-6 rounded-lg shadow-sm ${stat.link ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}`}
    >
      <div className="flex items-center">
        <div className="p-2 bg-blue-50 rounded-lg">
          <stat.icon className="w-6 h-6 text-blue-600" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{stat.name}</p>
          <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
        </div>
      </div>
    </div>
  );
} 