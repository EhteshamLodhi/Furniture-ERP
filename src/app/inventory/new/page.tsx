import MaterialForm from '@/components/forms/MaterialForm';

export default function NewMaterialPage() {
  return (
    <div className="px-4 sm:px-6 py-8 max-w-2xl mx-auto space-y-6">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1">Stock Overview</p>
        <h1 className="text-3xl font-extrabold text-primary tracking-tight font-headline">Add SKU</h1>
      </header>
      
      <MaterialForm />
    </div>
  );
}
