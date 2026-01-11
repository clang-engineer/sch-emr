import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Sql from './sql';
import SqlDetail from './sql-detail';
import SqlUpdate from './sql-update';
import SqlDeleteDialog from './sql-delete-dialog';
import SqlExecute from './sql-execute';

const SqlRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Sql />} />
    <Route path="new" element={<SqlUpdate />} />
    <Route path=":id">
      <Route index element={<SqlDetail />} />
      <Route path="edit" element={<SqlUpdate />} />
      <Route path="delete" element={<SqlDeleteDialog />} />
      <Route path="execute" element={<SqlExecute />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default SqlRoutes;
