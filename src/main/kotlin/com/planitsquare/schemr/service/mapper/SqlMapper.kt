package com.planitsquare.schemr.service.mapper

import com.planitsquare.schemr.domain.Sql
import com.planitsquare.schemr.service.dto.SqlDTO
import org.mapstruct.*

/**
 * Mapper for the entity [Sql] and its DTO [SqlDTO].
 */
@Mapper(componentModel = "spring")
interface SqlMapper :
    EntityMapper<SqlDTO, Sql>
