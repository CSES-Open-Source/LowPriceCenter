import React, { useState } from 'react';

interface FilterBarProps {
  filters: any;
  setFilters: (filters: any) => void;
}

const TAGS = [
  'Electronics',
  'School Supplies',
  'Dorm Essentials',
  'Furniture',
  'Clothes',
  'Miscellaneous',
];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-3 h-3 text-gray-400 transition-transform duration-200 shrink-10 ${open ? 'rotate-90' : ''}`}
      viewBox="0 0 6 10"
      fill="none"
    >
      <path
        d="M1 1l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TreeItem({
  label,
  isLast,
  active,
  onClick,
  right,
}: {
  label: string;
  isLast?: boolean;
  active?: boolean;
  onClick: () => void;
  right?: React.ReactNode;
}) {
  return (
    <div className="relative">
      {/* Vertical gold spine — clips at midpoint for last item */}
      <div
        className="absolute left-0 w-[1px] bg-ucsd-gold"
        style={{ top: 0, bottom: isLast ? '50%' : 0 }}
      />
      <button
        onClick={onClick}
        className="flex items-center w-full text-left py-[5px] pl-5 relative group"
      >
        {/* Horizontal gold branch */}
        <span className="absolute left-[1px] top-1/2 -translate-y-1/2 h-[1px] w-3 bg-ucsd-gold" />
        <span
          className={`text-sm flex-1 transition-colors duration-150 ${
            active
              ? 'font-semibold text-ucsd-darkblue'
              : 'text-gray-500 group-hover:text-ucsd-darkblue'
          }`}
        >
          {label}
        </span>
        {active && (
          <span className="w-2 h-2 rounded-full bg-ucsd-gold shrink-0 mr-1" />
        )}
        {right}
      </button>
    </div>
  );
}

export default function FilterBar({ filters, setFilters }: FilterBarProps) {
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [filterOpen, setFilterOpen] = useState(true);
  const [conditionOpen, setConditionOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);

  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t: string) => t !== tag)
      : [...currentTags, tag];
    setFilters({ ...filters, tags: newTags });
  };

  const clearFilters = () => {
    setFilters({ sortBy: 'timeCreated', order: 'desc', tags: [] });
  };

  const sectionHeaderClass =
    'flex items-center gap-2 w-full py-2 hover:opacity-80 transition-opacity';
  const iconBoxClass =
    'flex items-center justify-center w-5 h-5 rounded border border-ucsd-blue text-ucsd-blue shrink-0';

  return (
    <div className="text-sm font-inter select-none">

      {/* ══ CATEGORY ══ */}
      <button
        onClick={() => setCategoryOpen((o) => !o)}
        className={sectionHeaderClass}
      >
        <span className={iconBoxClass}>
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <rect x="0.75" y="0.75" width="7.5" height="7.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
            <line x1="2.5" y1="4.5" x2="6.5" y2="4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            {!categoryOpen && (
              <line x1="4.5" y1="2.5" x2="4.5" y2="6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            )}
          </svg>
        </span>
        <span className="font-bold text-[15px] text-ucsd-darkblue">Category</span>
        <Chevron open={categoryOpen} />
      </button>

      {categoryOpen && (
        <div className="ml-[10px] mt-0.5 mb-4">
          {TAGS.map((tag, i) => (
            <TreeItem
              key={tag}
              label={tag}
              isLast={i === TAGS.length - 1}
              active={filters.tags?.includes(tag)}
              onClick={() => handleTagToggle(tag)}
            />
          ))}
        </div>
      )}

      {/* ══ FILTER ══ */}
      <button
        onClick={() => setFilterOpen((o) => !o)}
        className={sectionHeaderClass}
      >
        <span className={iconBoxClass}>
          {/* Funnel / filter icon */}
          <svg width="11" height="10" viewBox="0 0 11 10" fill="none">
            <path d="M1 1.5h9M2.5 5h6M4 8.5h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </span>
        <span className="font-bold text-[15px] text-ucsd-darkblue">Filter</span>
        <Chevron open={filterOpen} />
      </button>

      {filterOpen && (
        <div className="ml-[10px] mt-0.5 mb-3">

          {/* Condition */}
          <TreeItem
            label="Condition"
            isLast={false}
            onClick={() => setConditionOpen((o) => !o)}
            right={<Chevron open={conditionOpen} />}
          />
          {conditionOpen && (
            <div className="ml-5 mt-1 mb-2">
              <select
                className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-ucsd-blue outline-none"
                value={filters.condition || ''}
                onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
              >
                <option value="">All</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
              </select>
            </div>
          )}

          {/* Price Range */}
          <TreeItem
            label="Price Range"
            isLast={true}
            onClick={() => setPriceOpen((o) => !o)}
            right={<Chevron open={priceOpen} />}
          />
            {priceOpen && (
            <div className="ml-5 mt-1 mb-2 space-y-2">

                {/* Row for Min / Max */}
                <div className="flex gap-2">
                <input
                    className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-ucsd-blue outline-none"
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                    setFilters({
                        ...filters,
                        minPrice: e.target.value ? Number(e.target.value) : undefined,
                    })
                    }
                />
                <span className="flex justify-between text-xs text-ucsd-gold font-semibold w-52">—</span>
                <input
                    className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-ucsd-blue outline-none"
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                    setFilters({
                        ...filters,
                        maxPrice: e.target.value ? Number(e.target.value) : undefined,
                    })
                    }
                />
                </div>

            </div>
            )}


        </div>
      )}

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="mt-3 text-xs text-gray-400 hover:text-ucsd-blue underline underline-offset-2 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}

