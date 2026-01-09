import React from 'react';
import ChartList from './chart-list';
import FormList from './form-list';
import PatientInfo from './patient-info';

const EmrPage = () => {
  return (
    <div className="flex h-screen">
      <div className="w-2/7 bg-gray-200">
        <div className="h-1/5 border-b border-gray-300">
          <PatientInfo />
        </div>
        <div className="h-2/5">
          <ChartList />
        </div>
        <div className="h-2/5">
          <FormList />
        </div>
      </div>
      <div className="w-5/7 bg-gray-400">Right</div>
    </div>
  );
};
export default EmrPage;
