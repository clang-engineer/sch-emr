package com.planitsquare.schemr.service.dto

import com.planitsquare.schemr.domain.SqlParam
import java.io.Serializable
import java.util.Objects
import javax.validation.constraints.*

/**
 * A DTO for the [com.planitsquare.schemr.domain.Sql] entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
data class SqlDTO(

    var id: Long? = null,

    @get: NotNull
    @get: Size(min = 5, max = 100)
    var title: String? = null,

    var description: String? = null,

    @get: NotNull
    var activated: String? = null,

    @get: NotNull
    var orderNo: Int? = null,

    var params: MutableSet<SqlParam> = mutableSetOf()
) : Serializable {

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is SqlDTO) return false
        val sqlDTO = other
        if (this.id == null) {
            return false
        }
        return Objects.equals(this.id, sqlDTO.id)
    }

    override fun hashCode() = Objects.hash(this.id)
}
