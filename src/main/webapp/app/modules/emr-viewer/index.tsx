import React from 'react';

import { Route } from 'react-router-dom';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import EmrPage from './page';

const EmrViewerRoutes = () => (
  <div>
    <ErrorBoundaryRoutes>
      <Route index element={<EmrPage />} />
    </ErrorBoundaryRoutes>
  </div>
);

export default EmrViewerRoutes;
