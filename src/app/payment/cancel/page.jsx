import React, { Suspense } from 'react';
import CancelSubscriptionPage from './Cancel';

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <CancelSubscriptionPage />
      </Suspense>
    </div>
  );
};

export default page;