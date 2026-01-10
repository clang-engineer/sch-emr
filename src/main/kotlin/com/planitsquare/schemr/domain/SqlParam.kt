package com.planitsquare.schemr.domain

import java.io.Serializable
import javax.persistence.*
import javax.validation.constraints.*

/**
 * SqlParam embeddable class for SQL parameters.
 */
@Embeddable
data class SqlParam(

    @get: NotNull
    @Column(name = "name", length = 100, nullable = false)
    var name: String? = null,

    @get: NotNull
    @Column(name = "type", length = 50, nullable = false)
    var type: String? = null

) : Serializable {

    override fun hashCode(): Int {
        return javaClass.hashCode()
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is SqlParam) return false
        return name == other.name
    }

    override fun toString(): String {
        return "SqlParam{" +
            "name='" + name + "'" +
            ", type='" + type + "'" +
            "}"
    }

    companion object {
        private const val serialVersionUID = 1L
    }
}
