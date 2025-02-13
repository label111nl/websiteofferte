import React from 'react';
import { Search, Filter } from 'lucide-react';

interface LeadFiltersProps {
  onFilterChange: (filters: {
    search: string;
    budgetRange: string;
    timeline: string;
  }) => void;
  onSortChange: (sort: { field: string; direction: 'asc' | 'desc' }) => void;
}

export default function LeadFilters({ onFilterChange, onSortChange }: LeadFiltersProps) {
  const [search, setSearch] = React.useState('');
  const [budgetRange, setBudgetRange] = React.useState('');
  const [timeline, setTimeline] = React.useState('');

  const handleChange = (
    field: 'search' | 'budgetRange' | 'timeline',
    value: string
  ) => {
    switch (field) {
      case 'search':
        setSearch(value);
        break;
      case 'budgetRange':
        setBudgetRange(value);
        break;
      case 'timeline':
        setTimeline(value);
        break;
    }

    onFilterChange({
      search: field === 'search' ? value : search,
      budgetRange: field === 'budgetRange' ? value : budgetRange,
      timeline: field === 'timeline' ? value : timeline,
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Zoek op bedrijfsnaam..."
          value={search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <select
            value={budgetRange}
            onChange={(e) => handleChange('budgetRange', e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Alle budgetten</option>
            <option value="500-1000">€500 - €1.000</option>
            <option value="1000-2500">€1.000 - €2.500</option>
            <option value="2500-5000">€2.500 - €5.000</option>
            <option value="5000-10000">€5.000 - €10.000</option>
            <option value="10000-20000">€10.000 - €20.000</option>
            <option value="20000+">€20.000+</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <select
            value={timeline}
            onChange={(e) => handleChange('timeline', e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Alle timelines</option>
            <option value="Zo snel mogelijk">Zo snel mogelijk</option>
            <option value="1-2 maanden">1-2 maanden</option>
            <option value="2-3 maanden">2-3 maanden</option>
            <option value="3-6 maanden">3-6 maanden</option>
            <option value="6+ maanden">6+ maanden</option>
          </select>
        </div>
      </div>
    </div>
  );
}