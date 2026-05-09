import SupplierForm from '@/components/forms/SupplierForm';

export default function NewSupplierPage() {
  return (
    <div className="px-4 sm:px-6 py-8 max-w-2xl mx-auto space-y-6">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1">Logistics & Supply</p>
        <h1 className="text-3xl font-extrabold text-primary tracking-tight font-headline">New Supplier</h1>
      </header>
      
      <SupplierForm />
    </div>
  );
}
