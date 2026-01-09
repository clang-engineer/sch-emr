import React from 'react';
import EmrTitle from './emr-title';
import EmrForm from './form';

const EmrPage = () => {
  return (
    <div className="flex h-screen">
      <div className="w-2/7 bg-gray-200">
        <div className="h-1/5 border-b border-gray-300">patient form</div>
        <div className="h-2/5 p-4 overflow-y-auto">chart list</div>
        <div className="h-2/5 p-4 overflow-y-auto">form list</div>
      </div>
      <div className="w-5/7 bg-gray-400">Right</div>
    </div>
  );
};
export default EmrPage;
