package com.planitsquare.schemr.service

import com.planitsquare.schemr.domain.* // for static metamodels
import com.planitsquare.schemr.domain.Book
import com.planitsquare.schemr.repository.BookRepository
import com.planitsquare.schemr.service.criteria.BookCriteria
import com.planitsquare.schemr.service.dto.BookDTO
import com.planitsquare.schemr.service.mapper.BookMapper
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import tech.jhipster.service.QueryService

/**
 * Service for executing complex queries for [Book] entities in the database.
 * The main input is a [BookCriteria] which gets converted to [Specification],
 * in a way that all the filters must apply.
 * It returns a [MutableList] of [BookDTO] or a [Page] of [BookDTO] which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
class BookQueryService(
    private val bookRepository: BookRepository,
    private val bookMapper: BookMapper,
) : QueryService<Book>() {

    private val log = LoggerFactory.getLogger(javaClass)

    /**
     * Return a [MutableList] of [BookDTO] which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    fun findByCriteria(criteria: BookCriteria?): MutableList<BookDTO> {
        log.debug("find by criteria : $criteria")
        val specification = createSpecification(criteria)
        return bookMapper.toDto(bookRepository.findAll(specification))
    }

    /**
     * Return a [Page] of [BookDTO] which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    fun findByCriteria(criteria: BookCriteria?, page: Pageable): Page<BookDTO> {
        log.debug("find by criteria : $criteria, page: $page")
        val specification = createSpecification(criteria)
        return bookRepository.findAll(specification, page)
            .map(bookMapper::toDto)
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    fun countByCriteria(criteria: BookCriteria?): Long {
        log.debug("count by criteria : $criteria")
        val specification = createSpecification(criteria)
        return bookRepository.count(specification)
    }

    /**
     * Function to convert [BookCriteria] to a [Specification].
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching [Specification] of the entity.
     */
    protected fun createSpecification(criteria: BookCriteria?): Specification<Book?> {
        var specification: Specification<Book?> = Specification.where(null)
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            val distinctCriteria = criteria.distinct
            if (distinctCriteria != null) {
                specification = specification.and(distinct(distinctCriteria))
            }
            if (criteria.id != null) {
                specification = specification.and(buildRangeSpecification(criteria.id, Book_.id))
            }
            if (criteria.title != null) {
                specification = specification.and(buildStringSpecification(criteria.title, Book_.title))
            }
            if (criteria.description != null) {
                specification = specification.and(buildStringSpecification(criteria.description, Book_.description))
            }
            if (criteria.activated != null) {
                specification = specification.and(buildSpecification(criteria.activated, Book_.activated))
            }
            if (criteria.orderNo != null) {
                specification = specification.and(buildRangeSpecification(criteria.orderNo, Book_.orderNo))
            }
        }
        return specification
    }
}
