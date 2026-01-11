import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { ISql, ISqlParam, SqlParamType } from 'app/shared/model/sql.model';
import { getEntity, updateEntity, createEntity, reset } from './sql.reducer';

export const SqlUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const sqlEntity = useAppSelector(state => state.sql.entity);
  const loading = useAppSelector(state => state.sql.loading);
  const updating = useAppSelector(state => state.sql.updating);
  const updateSuccess = useAppSelector(state => state.sql.updateSuccess);

  const [params, setParams] = useState<ISqlParam[]>([]);

  useEffect(() => {
    if (sqlEntity.params) {
      setParams(sqlEntity.params);
    }
  }, [sqlEntity]);

  const handleClose = () => {
    navigate('/sql' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...sqlEntity,
      ...values,
      params,
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const addParam = () => {
    setParams([...params, { name: '', type: SqlParamType.STRING }]);
  };

  const removeParam = (index: number) => {
    setParams(params.filter((_, i) => i !== index));
  };

  const updateParam = (index: number, field: keyof ISqlParam, value: any) => {
    const newParams = [...params];
    newParams[index] = { ...newParams[index], [field]: value };
    setParams(newParams);
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...sqlEntity,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="schemrApp.sql.home.createOrEditLabel" data-cy="SqlCreateUpdateHeading">
            Create or edit a Sql
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="sql-id" label="ID" validate={{ required: true }} /> : null}
              <ValidatedField
                label="Title"
                id="sql-title"
                name="title"
                data-cy="title"
                type="text"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                  minLength: { value: 5, message: 'This field is required to be at least 5 characters.' },
                  maxLength: { value: 50, message: 'This field cannot be longer than 50 characters.' },
                }}
              />
              <ValidatedField
                label="Description"
                id="sql-description"
                name="description"
                data-cy="description"
                type="text"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              />
              <ValidatedField label="Activated" id="sql-activated" name="activated" data-cy="activated" check type="checkbox" />
              <ValidatedField
                label="Order No"
                id="sql-orderNo"
                name="orderNo"
                data-cy="orderNo"
                type="text"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                  validate: v => isNumber(v) || 'This field should be a number.',
                }}
              />
              <div className="mb-3">
                <label className="form-label">Parameters</label>
                {params.map((param, index) => (
                  <div key={index} className="d-flex gap-2 mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Parameter name"
                      value={param.name || ''}
                      onChange={e => updateParam(index, 'name', e.target.value)}
                    />
                    <select
                      className="form-select"
                      value={param.type || SqlParamType.STRING}
                      onChange={e => updateParam(index, 'type', e.target.value as SqlParamType)}
                    >
                      {Object.values(SqlParamType).map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <Button color="danger" onClick={() => removeParam(index)}>
                      <FontAwesomeIcon icon="trash" />
                    </Button>
                  </div>
                ))}
                <Button color="secondary" onClick={addParam}>
                  <FontAwesomeIcon icon="plus" /> Add Parameter
                </Button>
              </div>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/sql" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Back</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Save
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default SqlUpdate;
