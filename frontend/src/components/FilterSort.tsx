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

function Chevron({ open, className = '' }: { open: boolean; className?: string }) {
  return (
    <svg
      className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${open ? 'rotate-180' : ''} ${className}`}
      viewBox="0 0 12 12"
      fill="none"
    >
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RightChevron({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`w-3.5 h-3.5 shrink-0 ${className}`}
      viewBox="0 0 12 12"
      fill="none"
    >
      <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function FilterBar({ filters, setFilters }: FilterBarProps) {
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [filterOpen, setFilterOpen] = useState(true);
  const [conditionOpen, setConditionOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(true);

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

  return (
    <div className="font-inter select-none text-ucsd-darkblue">

      {/* ══ CATEGORY ══ */}
      <div className="mb-6">
        <button
          onClick={() => setCategoryOpen((o) => !o)}
          className="flex items-center gap-2 w-full py-1 group"
        >
          {/* Box icon matching mockup */}
          <span className="flex items-center justify-center w-5 h-5 rounded border-2 border-ucsd-blue text-ucsd-blue shrink-0">
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <rect x="0.75" y="0.75" width="7.5" height="7.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
              <line x1="2.5" y1="4.5" x2="6.5" y2="4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              {!categoryOpen && (
                <line x1="4.5" y1="2.5" x2="4.5" y2="6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              )}
            </svg>
          </span>
          <span className="font-bold text-base text-ucsd-darkblue">Category</span>
          <Chevron open={categoryOpen} className="text-gray-400 ml-1" />
        </button>

        {categoryOpen && (
          <div className="relative mt-2 ml-[10px]">
            {/* Continuous gold vertical spine */}
            <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-ucsd-gold rounded-full" />

            {TAGS.map((tag, i) => {
              const active = filters.tags?.includes(tag);
              const isLast = i === TAGS.length - 1;
              return (
                <div key={tag} className="relative">
                  {/* Clip spine past midpoint of last row */}
                  {isLast && (
                    <div className="absolute left-0 bottom-0 w-[3px] bg-white" style={{ top: '50%' }} />
                  )}
                  <button
                    onClick={() => handleTagToggle(tag)}
                    className="flex items-center w-full text-left py-[5px] pl-5 group"
                  >
                    {/* Horizontal gold branch */}
                    <span className="absolute left-[1px] top-1/2 -translate-y-1/2 w-3 h-[1px] bg-ucsd-gold" />
                    <span
                      className={`text-[13.5px] transition-colors ${
                        active
                          ? 'font-semibold text-ucsd-darkblue'
                          : 'text-gray-500 group-hover:text-ucsd-darkblue'
                      }`}
                    >
                      {tag}
                    </span>
                    {active && (
                      <span className="ml-auto mr-0.5 w-1.5 h-1.5 rounded-full bg-ucsd-gold shrink-0" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ══ FILTER ══ */}
      <div>
        <button
          onClick={() => setFilterOpen((o) => !o)}
          className="flex items-center gap-2 w-full py-1 group"
        >
          {/* Funnel icon */}
          <span className="flex items-center justify-center w-5 h-5 rounded border-2 border-ucsd-blue text-ucsd-blue shrink-0">
            <svg width="11" height="10" viewBox="0 0 11 10" fill="none">
              <path d="M1 1.5h9M2.5 5h6M4 8.5h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </span>
          <span className="font-bold text-base text-ucsd-darkblue">Filter</span>
          <Chevron open={filterOpen} className="text-gray-400 ml-1" />
        </button>

        {filterOpen && (
          <div className="relative mt-2 ml-[10px]">
            {/* Gold spine — only covers the two items, clipped at last */}
            <div
              className="absolute left-0 w-[1px] bg-ucsd-gold rounded-full"
              style={{ top: 0, bottom: priceOpen ? 0 : '20%' }}
            />

            {/* Condition */}
            <div className="relative">
              <button
                onClick={() => setConditionOpen((o) => !o)}
                className="flex items-center w-full text-left py-[5px] pl-5 group"
              >
                <span className="absolute left-[1px] top-1/2 -translate-y-1/2 w-3 h-[1px] bg-ucsd-gold" />
                <span className="text-[13.5px] text-gray-500 group-hover:text-ucsd-darkblue flex-1">
                  Condition
                </span>
                <RightChevron className="text-gray-400 mr-1" />
              </button>
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
            </div>

            {/* Price Range */}
            <div className="relative">
              {/* Clip gold spine after midpoint */}
              <div className="absolute left-0 w-[1px] bg-white" style={{ top: '50%', bottom: 0 }} />
              <button
                onClick={() => setPriceOpen((o) => !o)}
                className="flex items-center w-full text-left py-[5px] pl-5 group"
              >
                <span className="absolute left-[1px] top-1/2 -translate-y-1/2 w-3 h-[1px] bg-ucsd-gold" />
                <span className="text-[13.5px] text-gray-500 group-hover:text-ucsd-darkblue flex-1">
                  Price Range
                </span>
                <Chevron open={priceOpen} className="text-gray-400 mr-1" />
              </button>
              {priceOpen && (
                <div className="ml-5 mt-2 mb-1">
                  {/* Min — Max inline like mockup */}
                  <div className="flex items-center gap-2">
                    <input
                      className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-ucsd-blue outline-none"
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice || ''}
                      onChange={(e) =>
                        setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })
                      }
                    />
                    <span className="text-ucsd-gold font-bold shrink-0">—</span>
                    <input
                      className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-ucsd-blue outline-none"
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice || ''}
                      onChange={(e) =>
                        setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="mt-7 text-xs text-gray-400 hover:text-ucsd-blue underline underline-offset-2 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}