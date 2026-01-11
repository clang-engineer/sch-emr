package com.planitsquare.schemr.service.criteria

import org.springdoc.api.annotations.ParameterObject
import tech.jhipster.service.Criteria
import tech.jhipster.service.filter.*
import java.io.Serializable

/**
 * Criteria class for the [com.planitsquare.schemr.domain.Book] entity. This class is used in
 * [com.planitsquare.schemr.web.rest.BookResource] to receive all the possible filtering options from the
 * Http GET request parameters.
 * For example the following could be a valid request:
 * ```/books?id.greaterThan=5&attr1.contains=something&attr2.specified=false```
 * As Spring is unable to properly convert the types, unless specific [Filter] class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
data class BookCriteria(
    var id: LongFilter? = null,
    var title: StringFilter? = null,
    var description: StringFilter? = null,
    var activated: BooleanFilter? = null,
    var orderNo: IntegerFilter? = null,
    var distinct: Boolean? = null
) : Serializable, Criteria {

    constructor(other: BookCriteria) :
        this(
            other.id?.copy(),
            other.title?.copy(),
            other.description?.copy(),
            other.activated?.copy(),
            other.orderNo?.copy(),
            other.distinct
        )

    override fun copy() = BookCriteria(this)

    companion object {
        private const val serialVersionUID: Long = 1L
    }
}
