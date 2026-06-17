import React, { Suspense } from 'react';
import RecruiterBillingPage from './Billing';

const page = () => {
  return (
    <div>

      <Suspense fallback={<div>Loading...</div>}>

        <RecruiterBillingPage /> 

      </Suspense>
      
    </div>
  );
};

export default page;