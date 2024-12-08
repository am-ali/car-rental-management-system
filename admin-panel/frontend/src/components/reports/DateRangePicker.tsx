interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (dates: { startDate: string; endDate: string }) => void;
}

export default function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
  return (
    <div className="flex items-center space-x-4">
      <div>
        <label htmlFor="startDate" className="block text-sm text-gray-600">Start Date</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          max={endDate}
          onChange={(e) => onChange({ startDate: e.target.value, endDate })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <div>
        <label htmlFor="endDate" className="block text-sm text-gray-600">End Date</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          min={startDate}
          max={new Date().toISOString().split('T')[0]}
          onChange={(e) => onChange({ startDate, endDate: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
    </div>
  );
} 