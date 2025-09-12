import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Target } from 'lucide-react';

const LoanCalculator = () => {
  const { register, watch, setValue, getValues } = useForm();
  const { amount, interest, tenure } = watch();
  useEffect(() => {
    // EMI = P x r x (1 + r)^n / (1 + r)^n - 1
    const monthlyRate = Number(interest) / 12 / 100;
    const emi =
      (Number(amount) * monthlyRate * Math.pow(1 + monthlyRate, Number(tenure) * 12)) /
      (Math.pow(1 + monthlyRate, Number(tenure) * 12) - 1);
    setValue('emi', emi);
  }, [amount, interest, tenure]);
  return (
    <div className="max-w-80 grid grid-cols-2">
      <h1 className="text-2xl">Loan EMI Calculator</h1>
      <label>Loan Amount</label>
      <input className="w-full" {...register('amount', { required: true })} />
      <label>Interest Rate</label>
      <input className="w-full" {...register('interest', { required: true })} />
      <label>Tenure (in years)</label>
      <input className="w-full" {...register('tenure', { required: true })} />
      <p>Monthly EMI:</p>
      <p className="text-end">{Math.ceil(getValues('emi'))}</p>
      <p>Principal Amount:</p>
      <p className="text-end">{Math.ceil(getValues('amount'))}</p>
      <p>Total Interest:</p>
      <p className="text-end">{Math.ceil(getValues('emi') * getValues('tenure') * 12)}</p>
      <p>Total Amount:</p>
      <p className="text-end">{Math.ceil(getValues('emi') * getValues('tenure') * 12 - getValues('amount'))}</p>
    </div>
  );
};

// Placeholder components for new features
export const GoalsContent = () => (
  <>
    <div className="glass-card rounded-xl p-8 text-center">
      <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-white mb-2">Set Your Financial Goals</h3>
      <p className="text-slate-400 mb-6">Track progress towards emergency fund, vacation, or retirement savings</p>
      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Create Your First Goal
      </button>
    </div>
    <LoanCalculator />
  </>
);
