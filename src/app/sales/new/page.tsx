import SaleEntryForm from '@/components/forms/SaleEntryForm';
import { getCustomers } from '@/lib/actions/customers';

export default async function NewSalePage() {
  const customers = await getCustomers();

  return (
    <div className="px-4 sm:px-6 py-8 max-w-3xl mx-auto space-y-6">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1">Stage 1: Sale Entry</p>
        <h1 className="text-3xl font-extrabold text-primary tracking-tight font-headline">New Sale</h1>
      </header>
      
      <SaleEntryForm customers={customers} />
    </div>
  );
}
