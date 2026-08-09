import CustomerForm from '@/components/forms/CustomerForm';

export default async function NewCustomerPage() {
  return (
    <div className="px-4 sm:px-6 py-8 max-w-2xl mx-auto space-y-6">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1">Portfolio Relations</p>
        <h1 className="text-3xl font-extrabold text-primary tracking-tight font-headline">New Account</h1>
      </header>
      
      <CustomerForm />
    </div>
  );
}
