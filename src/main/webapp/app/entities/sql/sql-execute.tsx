import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, Row, Col, Form, FormGroup, Label, Input, Table, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from './sql.reducer';
import { SqlParamType } from 'app/shared/model/sql.model';

export const SqlExecute = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { id } = useParams<'id'>();

  const [paramValues, setParamValues] = useState<Record<string, any>>({});
  const [queryResult, setQueryResult] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sqlEntity = useAppSelector(state => state.sql.entity);

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const handleParamChange = (paramName: string, value: any) => {
    setParamValues({
      ...paramValues,
      [paramName]: value,
    });
  };

  const handleExecute = async () => {
    setLoading(true);
    setError(null);
    setQueryResult(null);

    try {
      const response = await axios.post('/api/ods', {
        key: sqlEntity.title,
        map: paramValues,
      });
      setQueryResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (paramName: string, paramType: SqlParamType) => {
    const value = paramValues[paramName] || '';

    switch (paramType) {
      case SqlParamType.BOOLEAN:
        return (
          <Input type="select" value={value} onChange={e => handleParamChange(paramName, e.target.value === 'true')}>
            <option value="">Select...</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </Input>
        );
      case SqlParamType.INTEGER:
      case SqlParamType.LONG:
        return <Input type="number" value={value} onChange={e => handleParamChange(paramName, parseInt(e.target.value, 10))} step="1" />;
      case SqlParamType.DECIMAL:
        return <Input type="number" value={value} onChange={e => handleParamChange(paramName, parseFloat(e.target.value))} step="0.01" />;
      case SqlParamType.DATE:
        return <Input type="date" value={value} onChange={e => handleParamChange(paramName, e.target.value)} />;
      case SqlParamType.DATETIME:
        return <Input type="datetime-local" value={value} onChange={e => handleParamChange(paramName, e.target.value)} />;
      case SqlParamType.TIME:
        return <Input type="time" value={value} onChange={e => handleParamChange(paramName, e.target.value)} />;
      case SqlParamType.STRING:
      default:
        return <Input type="text" value={value} onChange={e => handleParamChange(paramName, e.target.value)} />;
    }
  };

  const renderResultTable = () => {
    if (!queryResult || queryResult.length === 0) {
      return <Alert color="info">No results found</Alert>;
    }

    const columns = Object.keys(queryResult[0]);

    return (
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {queryResult.map((row, idx) => (
              <tr key={idx}>
                {columns.map(col => (
                  <td key={col}>{String(row[col] ?? '')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  return (
    <div>
      <Row>
        <Col md="8">
          <h2 data-cy="sqlExecuteHeading">Execute SQL: {sqlEntity.title}</h2>

          {sqlEntity.description && <p className="text-muted">{sqlEntity.description}</p>}

          <Form>
            {sqlEntity.params && sqlEntity.params.length > 0 ? (
              sqlEntity.params.map((param, i) => (
                <FormGroup key={i}>
                  <Label for={param.name}>
                    {param.name} <span className="text-muted">({param.type})</span>
                  </Label>
                  {renderInput(param.name, param.type)}
                </FormGroup>
              ))
            ) : (
              <Alert color="info">This SQL has no parameters</Alert>
            )}

            <div className="mt-3">
              <Button color="primary" onClick={handleExecute} disabled={loading}>
                <FontAwesomeIcon icon="play" /> {loading ? 'Executing...' : 'Execute'}
              </Button>{' '}
              <Button tag={Link} to="/sql" color="secondary">
                <FontAwesomeIcon icon="arrow-left" /> Back
              </Button>
            </div>
          </Form>

          {error && (
            <Alert color="danger" className="mt-3">
              <strong>Error:</strong> {error}
            </Alert>
          )}

          {queryResult && (
            <div className="mt-4">
              <h3>Results ({queryResult.length} rows)</h3>
              {renderResultTable()}
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default SqlExecute;
