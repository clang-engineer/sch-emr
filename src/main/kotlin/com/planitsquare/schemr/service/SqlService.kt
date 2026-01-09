package com.planitsquare.schemr.service
import com.planitsquare.schemr.service.dto.SqlDTO
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import java.util.Optional

/**
 * Service Interface for managing [com.planitsquare.schemr.domain.Sql].
 */
interface SqlService {

    /**
     * Save a sql.
     *
     * @param sqlDTO the entity to save.
     * @return the persisted entity.
     */
    fun save(sqlDTO: SqlDTO): SqlDTO

    /**
     * Updates a sql.
     *
     * @param sqlDTO the entity to update.
     * @return the persisted entity.
     */
    fun update(sqlDTO: SqlDTO): SqlDTO

    /**
     * Partially updates a sql.
     *
     * @param sqlDTO the entity to update partially.
     * @return the persisted entity.
     */
    fun partialUpdate(sqlDTO: SqlDTO): Optional<SqlDTO>

    /**
     * Get all the sqls.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    fun findAll(pageable: Pageable): Page<SqlDTO>

    /**
     * Get the "id" sql.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    fun findOne(id: Long): Optional<SqlDTO>

    /**
     * Delete the "id" sql.
     *
     * @param id the id of the entity.
     */
    fun delete(id: Long)
}
