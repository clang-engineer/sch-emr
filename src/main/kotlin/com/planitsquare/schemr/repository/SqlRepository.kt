package com.planitsquare.schemr.repository

import com.planitsquare.schemr.domain.Sql
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

/**
 * Spring Data JPA repository for the Sql entity.
 */
@Suppress("unused")
@Repository
interface SqlRepository : JpaRepository<Sql, Long>, JpaSpecificationExecutor<Sql>
