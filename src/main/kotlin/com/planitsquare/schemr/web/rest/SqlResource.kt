package com.planitsquare.schemr.web.rest

import com.planitsquare.schemr.repository.SqlRepository
import com.planitsquare.schemr.service.SqlQueryService
import com.planitsquare.schemr.service.SqlService
import com.planitsquare.schemr.service.criteria.SqlCriteria
import com.planitsquare.schemr.service.dto.SqlDTO
import com.planitsquare.schemr.web.rest.errors.BadRequestAlertException
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.domain.Pageable
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.servlet.support.ServletUriComponentsBuilder
import tech.jhipster.web.util.HeaderUtil
import tech.jhipster.web.util.PaginationUtil
import tech.jhipster.web.util.ResponseUtil
import java.net.URI
import java.net.URISyntaxException
import java.util.Objects
import javax.validation.Valid
import javax.validation.constraints.NotNull

private const val ENTITY_NAME = "sql"
/**
 * REST controller for managing [com.planitsquare.schemr.domain.Sql].
 */
@RestController
@RequestMapping("/api")
class SqlResource(
    private val sqlService: SqlService,
    private val sqlRepository: SqlRepository,
    private val sqlQueryService: SqlQueryService,
) {

    private val log = LoggerFactory.getLogger(javaClass)

    companion object {
        const val ENTITY_NAME = "sql"
    }

    @Value("\${jhipster.clientApp.name}")
    private var applicationName: String? = null

    /**
     * `POST  /sqls` : Create a new sql.
     *
     * @param sqlDTO the sqlDTO to create.
     * @return the [ResponseEntity] with status `201 (Created)` and with body the new sqlDTO, or with status `400 (Bad Request)` if the sql has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sqls")
    fun createSql(@Valid @RequestBody sqlDTO: SqlDTO): ResponseEntity<SqlDTO> {
        log.debug("REST request to save Sql : $sqlDTO")
        if (sqlDTO.id != null) {
            throw BadRequestAlertException(
                "A new sql cannot already have an ID",
                ENTITY_NAME, "idexists"
            )
        }
        val result = sqlService.save(sqlDTO)
        return ResponseEntity.created(URI("/api/sqls/${result.id}"))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.id.toString()))
            .body(result)
    }

    /**
     * {@code PUT  /sqls/:id} : Updates an existing sql.
     *
     * @param id the id of the sqlDTO to save.
     * @param sqlDTO the sqlDTO to update.
     * @return the [ResponseEntity] with status `200 (OK)` and with body the updated sqlDTO,
     * or with status `400 (Bad Request)` if the sqlDTO is not valid,
     * or with status `500 (Internal Server Error)` if the sqlDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sqls/{id}")
    fun updateSql(
        @PathVariable(value = "id", required = false) id: Long,
        @Valid @RequestBody sqlDTO: SqlDTO
    ): ResponseEntity<SqlDTO> {
        log.debug("REST request to update Sql : {}, {}", id, sqlDTO)
        if (sqlDTO.id == null) {
            throw BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull")
        }

        if (!Objects.equals(id, sqlDTO.id)) {
            throw BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid")
        }

        if (!sqlRepository.existsById(id)) {
            throw BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound")
        }

        val result = sqlService.update(sqlDTO)
        return ResponseEntity.ok()
            .headers(
                HeaderUtil.createEntityUpdateAlert(
                    applicationName, false, ENTITY_NAME,
                    sqlDTO.id.toString()
                )
            )
            .body(result)
    }

    /**
     * {@code PATCH  /sqls/:id} : Partial updates given fields of an existing sql, field will ignore if it is null
     *
     * @param id the id of the sqlDTO to save.
     * @param sqlDTO the sqlDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sqlDTO,
     * or with status {@code 400 (Bad Request)} if the sqlDTO is not valid,
     * or with status {@code 404 (Not Found)} if the sqlDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the sqlDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = ["/sqls/{id}"], consumes = ["application/json", "application/merge-patch+json"])
    @Throws(URISyntaxException::class)
    fun partialUpdateSql(
        @PathVariable(value = "id", required = false) id: Long,
        @NotNull @RequestBody sqlDTO: SqlDTO
    ): ResponseEntity<SqlDTO> {
        log.debug("REST request to partial update Sql partially : {}, {}", id, sqlDTO)
        if (sqlDTO.id == null) {
            throw BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull")
        }
        if (!Objects.equals(id, sqlDTO.id)) {
            throw BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid")
        }

        if (!sqlRepository.existsById(id)) {
            throw BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound")
        }

        val result = sqlService.partialUpdate(sqlDTO)

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, sqlDTO.id.toString())
        )
    }

    /**
     * `GET  /sqls` : get all the sqls.
     *
     * @param pageable the pagination information.

     * @param criteria the criteria which the requested entities should match.
     * @return the [ResponseEntity] with status `200 (OK)` and the list of sqls in body.
     */
    @GetMapping("/sqls") fun getAllSqls(
        criteria: SqlCriteria,
        @org.springdoc.api.annotations.ParameterObject pageable: Pageable

    ): ResponseEntity<MutableList<SqlDTO>> {
        log.debug("REST request to get Sqls by criteria: $criteria")
        val page = sqlQueryService.findByCriteria(criteria, pageable)
        val headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page)
        return ResponseEntity.ok().headers(headers).body(page.content)
    }

    /**
     * `GET  /sqls/count}` : count all the sqls.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the [ResponseEntity] with status `200 (OK)` and the count in body.
     */
    @GetMapping("/sqls/count")
    fun countSqls(criteria: SqlCriteria): ResponseEntity<Long> {
        log.debug("REST request to count Sqls by criteria: $criteria")
        return ResponseEntity.ok().body(sqlQueryService.countByCriteria(criteria))
    }

    /**
     * `GET  /sqls/:id` : get the "id" sql.
     *
     * @param id the id of the sqlDTO to retrieve.
     * @return the [ResponseEntity] with status `200 (OK)` and with body the sqlDTO, or with status `404 (Not Found)`.
     */
    @GetMapping("/sqls/{id}")
    fun getSql(@PathVariable id: Long): ResponseEntity<SqlDTO> {
        log.debug("REST request to get Sql : $id")
        val sqlDTO = sqlService.findOne(id)
        return ResponseUtil.wrapOrNotFound(sqlDTO)
    }
    /**
     *  `DELETE  /sqls/:id` : delete the "id" sql.
     *
     * @param id the id of the sqlDTO to delete.
     * @return the [ResponseEntity] with status `204 (NO_CONTENT)`.
     */
    @DeleteMapping("/sqls/{id}")
    fun deleteSql(@PathVariable id: Long): ResponseEntity<Void> {
        log.debug("REST request to delete Sql : $id")

        sqlService.delete(id)
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build()
    }
}
