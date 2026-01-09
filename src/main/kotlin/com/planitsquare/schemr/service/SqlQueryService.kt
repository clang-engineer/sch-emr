package com.planitsquare.schemr.service

import com.planitsquare.schemr.domain.* // for static metamodels
import com.planitsquare.schemr.domain.Sql
import com.planitsquare.schemr.repository.SqlRepository
import com.planitsquare.schemr.service.criteria.SqlCriteria
import com.planitsquare.schemr.service.dto.SqlDTO
import com.planitsquare.schemr.service.mapper.SqlMapper
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import tech.jhipster.service.QueryService

/**
 * Service for executing complex queries for [Sql] entities in the database.
 * The main input is a [SqlCriteria] which gets converted to [Specification],
 * in a way that all the filters must apply.
 * It returns a [MutableList] of [SqlDTO] or a [Page] of [SqlDTO] which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
class SqlQueryService(
    private val sqlRepository: SqlRepository,
    private val sqlMapper: SqlMapper,
) : QueryService<Sql>() {

    private val log = LoggerFactory.getLogger(javaClass)

    /**
     * Return a [MutableList] of [SqlDTO] which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    fun findByCriteria(criteria: SqlCriteria?): MutableList<SqlDTO> {
        log.debug("find by criteria : $criteria")
        val specification = createSpecification(criteria)
        return sqlMapper.toDto(sqlRepository.findAll(specification))
    }

    /**
     * Return a [Page] of [SqlDTO] which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    fun findByCriteria(criteria: SqlCriteria?, page: Pageable): Page<SqlDTO> {
        log.debug("find by criteria : $criteria, page: $page")
        val specification = createSpecification(criteria)
        return sqlRepository.findAll(specification, page)
            .map(sqlMapper::toDto)
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    fun countByCriteria(criteria: SqlCriteria?): Long {
        log.debug("count by criteria : $criteria")
        val specification = createSpecification(criteria)
        return sqlRepository.count(specification)
    }

    /**
     * Function to convert [SqlCriteria] to a [Specification].
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching [Specification] of the entity.
     */
    protected fun createSpecification(criteria: SqlCriteria?): Specification<Sql?> {
        var specification: Specification<Sql?> = Specification.where(null)
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            val distinctCriteria = criteria.distinct
            if (distinctCriteria != null) {
                specification = specification.and(distinct(distinctCriteria))
            }
            if (criteria.id != null) {
                specification = specification.and(buildRangeSpecification(criteria.id, Sql_.id))
            }
            if (criteria.title != null) {
                specification = specification.and(buildStringSpecification(criteria.title, Sql_.title))
            }
            if (criteria.description != null) {
                specification = specification.and(buildStringSpecification(criteria.description, Sql_.description))
            }
            if (criteria.activated != null) {
                specification = specification.and(buildStringSpecification(criteria.activated, Sql_.activated))
            }
            if (criteria.orderNo != null) {
                specification = specification.and(buildRangeSpecification(criteria.orderNo, Sql_.orderNo))
            }
        }
        return specification
    }
}
