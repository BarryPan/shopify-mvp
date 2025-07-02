'use client';

interface Props {
  categories: string[];
  active: string | null;
  onSelect: (c: string | null) => void;
}

export default function CategoryFilter({ categories, active, onSelect }: Props) {
  return (
    <div className="mt-4 flex flex-wrap gap-3 overflow-x-auto">
      <button
        onClick={() => onSelect(null)}
        className={`rounded-full px-4 py-2 text-sm ${
          !active ? 'bg-green-600 text-white' : 'border'
        }`}
      >
        All Products
      </button>

      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`rounded-full border px-4 py-2 text-sm ${
            active === cat ? 'bg-green-600 text-white' : ''
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
