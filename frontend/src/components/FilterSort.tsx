import React from 'react';

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
  'Miscellaneous'
];

export default function FilterBar({ filters, setFilters }: FilterBarProps) {
  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t: string) => t !== tag)
      : [...currentTags, tag];
    
    setFilters({ ...filters, tags: newTags });
  };

  const clearFilters = () => {
    setFilters({
      sortBy: 'timeCreated',
      order: 'desc'
    });
  };

  return (
    <div className="filter-bar">
      {/* Price Range */}
      <div className="filter-section">
        <h3>Price Range</h3>
        <input
          type="number"
          placeholder="Min"
          value={filters.minPrice || ''}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
        />
        <input
          type="number"
          placeholder="Max"
          value={filters.maxPrice || ''}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
        />
      </div>

      {/* Condition */}
      <div className="filter-section">
        <h3>Condition</h3>
        <select
          value={filters.condition || ''}
          onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
        >
          <option value="">All</option>
          <option value="New">New</option>
          <option value="Used">Used</option>
        </select>
      </div>

      {/* Tags/Categories */}
      <div className="filter-section">
        <h3>Categories</h3>
        <div className="tag-buttons">
          {TAGS.map(tag => (
            <button
              key={tag}
              className={filters.tags?.includes(tag) ? 'active' : ''}
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Sorting */}
      <div className="filter-section">
        <h3>Sort By</h3>
        <select
          value={filters.sortBy || 'timeCreated'}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
        >
          <option value="timeCreated">Date Posted</option>
          <option value="price">Price</option>
        </select>
        
        <select
          value={filters.order || 'desc'}
          onChange={(e) => setFilters({ ...filters, order: e.target.value })}
        >
          <option value="desc">
            {filters.sortBy === 'price' ? 'High to Low' : 
             filters.sortBy === 'timeCreated' ? 'Newest First' : 'Descending'}
          </option>
          <option value="asc">
            {filters.sortBy === 'price' ? 'Low to High' : 
             filters.sortBy === 'timeCreated' ? 'Oldest First' : 'Ascending'}
          </option>
        </select>
      </div>

      <button onClick={clearFilters}>Clear All Filters</button>
    </div>
  );
}