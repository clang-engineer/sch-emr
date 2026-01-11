import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './sql.reducer';

export const SqlDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const sqlEntity = useAppSelector(state => state.sql.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="sqlDetailsHeading">Sql</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{sqlEntity.id}</dd>
          <dt>
            <span id="title">Title</span>
          </dt>
          <dd>{sqlEntity.title}</dd>
          <dt>
            <span id="description">Description</span>
          </dt>
          <dd>{sqlEntity.description}</dd>
          <dt>
            <span id="activated">Activated</span>
          </dt>
          <dd>{sqlEntity.activated ? 'true' : 'false'}</dd>
          <dt>
            <span id="orderNo">Order No</span>
          </dt>
          <dd>{sqlEntity.orderNo}</dd>
          <dt>
            <span id="params">Parameters</span>
          </dt>
          <dd>
            {sqlEntity.params && sqlEntity.params.length > 0 ? (
              <ul>
                {sqlEntity.params.map((param, i) => (
                  <li key={i}>
                    <strong>{param.name}</strong>: {param.type}
                  </li>
                ))}
              </ul>
            ) : (
              <span>No parameters</span>
            )}
          </dd>
        </dl>
        <Button tag={Link} to="/sql" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/sql/${sqlEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default SqlDetail;
