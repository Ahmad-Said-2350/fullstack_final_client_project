import React, { Suspense } from 'react';
import PaymentSuccessPage from './Success';

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <PaymentSuccessPage />
      </Suspense>
    </div>
  );
};

export default page;