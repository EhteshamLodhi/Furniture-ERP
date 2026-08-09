'use client';

import { useState } from 'react';
import { formatCurrency, cn } from '@/lib/utils';
import { Material } from '@/lib/types';
import DeleteEntryButton from '@/components/DeleteEntryButton';
import Icon from '@/components/ui/Icon';

const categories = ['All Stock', 'Sheet', 'Hardware', 'Cushion', 'PVC', 'Brass', 'Pegs', 'Glass', 'Other'];

export default function InventoryList({ initialMaterials }: { initialMaterials: Material[] }) {
  const [activeFilter, setActiveFilter] = useState('All Stock');

  const filtered = activeFilter === 'All Stock'
    ? initialMaterials
    : initialMaterials.filter(m => m.category === activeFilter);

  const totalValue = initialMaterials.reduce((sum, m) => sum + (m.stock_quantity * m.unit_cost), 0);
  const lowStock = initialMaterials.filter(m => m.stock_quantity < 10).length;

  return (
    <div className="space-y-6">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-primary-container rounded-xl p-6 shadow-card relative overflow-hidden group">
          <div className="z-10 relative">
            <p className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-primary-container mb-2 opacity-80">Total Inventory Value</p>
            <h2 className="font-headline text-3xl font-bold text-on-primary-container mb-1">{formatCurrency(totalValue)}</h2>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Icon name="payments" className="text-8xl" />
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-error-container text-on-error-container">
              <Icon name="warning" className="text-lg" />
            </div>
            <p className="font-label text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">Low Stock Alert (&lt; 10 units)</p>
          </div>
          <h3 className={cn("font-headline text-3xl font-bold", lowStock > 0 ? "text-error" : "text-primary")}>{lowStock}</h3>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={cn(
              'flex-none font-label text-[11px] font-semibold uppercase tracking-wider px-5 py-2.5 rounded-full transition-all',
              activeFilter === cat ? 'bg-primary text-white shadow-md' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Materials List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1 mb-2">
          <h3 className="font-headline text-sm font-bold text-primary">Inventory Items</h3>
        </div>
        {filtered.map(material => {
          const isLow = material.stock_quantity < 10;
          return (
            <div key={material.id} className={`bg-surface-container-lowest rounded-xl p-5 shadow-sm border-l-4 transition-all hover:translate-x-1 ${isLow ? 'border-error shadow-error/5' : 'border-secondary-fixed'}`}>
              <div className="flex justify-between items-start mb-2 gap-3">
                <div>
                  <h4 className="font-headline text-lg font-bold text-primary">{material.name}</h4>
                  <p className="font-label text-[10px] text-outline uppercase tracking-widest font-semibold">{material.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider',
                    isLow ? 'bg-error-container text-on-error-container' : 'bg-secondary-fixed text-on-secondary-fixed-variant'
                  )}>
                    {isLow ? 'Low Stock' : 'Optimal'}
                  </span>
                  <DeleteEntryButton entryId={material.id} kind="material" label={material.name} />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-surface-container-high">
                <div>
                  <p className="text-[10px] text-outline-variant font-semibold uppercase tracking-widest mb-1">Quantity</p>
                  <p className="font-headline text-base font-bold text-primary">
                    {material.stock_quantity} <span className="text-xs font-normal text-outline-variant">{material.unit}</span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-outline-variant font-semibold uppercase tracking-widest mb-1">Unit Cost</p>
                  <p className="font-headline text-base font-bold text-on-surface">
                    {formatCurrency(material.unit_cost)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-outline-variant font-semibold uppercase tracking-widest mb-1">Total Value</p>
                  <p className="font-headline text-base font-bold text-secondary">
                    {formatCurrency(material.stock_quantity * material.unit_cost)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
