import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { LoanForm } from '../components/LoanForm';

export const ApplicationPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const nameParam = searchParams.get('name');
  const amountParam = searchParams.get('amount');
  const planParam = searchParams.get('plan') as 'Daily' | 'Weekly' | null;
  const panParam = searchParams.get('pan');
  const mobileParam = searchParams.get('mobile');

  const initialAmount = amountParam ? parseInt(amountParam, 10) : undefined;
  const initialPlan = planParam || undefined;

  return (
    <div className="w-full bg-[#07132e] text-white min-h-screen flex flex-col">
      {/* Main Multi-step Loan Form */}
      <div className="flex-1 w-full max-w-full">
        <LoanForm
          initialName={nameParam || undefined}
          initialAmount={initialAmount}
          initialPlan={initialPlan}
          initialPan={panParam || undefined}
          initialMobile={mobileParam || undefined}
        />
      </div>
    </div>
  );
};
