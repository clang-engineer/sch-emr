package com.planitsquare.schemr.domain

import org.hibernate.annotations.Cache
import org.hibernate.annotations.CacheConcurrencyStrategy
import java.io.Serializable
import javax.persistence.*
import javax.validation.constraints.*

/**
 * A Book.
 */

@Entity
@Table(name = "tbl_book")

@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
data class Book(

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    var id: Long? = null,

    @get: NotNull
    @get: Size(min = 5, max = 20)

    @Column(name = "title", length = 20, nullable = false, unique = true)
    var title: String? = null,

    @get: NotNull

    @Column(name = "description", nullable = false)
    var description: String? = null,

    @get: NotNull

    @Column(name = "activated", nullable = false)
    var activated: Boolean? = null,

    @get: NotNull

    @Column(name = "order_no", nullable = false)
    var orderNo: Int? = null,

    // jhipster-needle-entity-add-field - JHipster will add fields here
) : Serializable {

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    override fun hashCode(): Int {
        return javaClass.hashCode()
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Book) return false
        return id != null && other.id != null && id == other.id
    }

    override fun toString(): String {
        return "Book{" +
            "id=" + id +
            ", title='" + title + "'" +
            ", description='" + description + "'" +
            ", activated='" + activated + "'" +
            ", orderNo=" + orderNo +
            "}"
    }

    companion object {
        private const val serialVersionUID = 1L
    }
}
