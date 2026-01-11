package com.planitsquare.schemr.web.rest

import com.planitsquare.schemr.service.SqlService
import com.planitsquare.schemr.service.dto.SqlDTO
import com.planitsquare.schemr.web.rest.vm.OdsSearchVM
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

private const val ENTITY_NAME = "sql"

@RestController
@RequestMapping("/api")
class OdsSearchController(private val sqlService: SqlService) {

    private val log = LoggerFactory.getLogger(javaClass)

    @PostMapping("/ods")
    fun search(@Valid @RequestBody odsSearhVM: OdsSearchVM): ResponseEntity<SqlDTO> {
        log.debug("REST request to seearch ODS  : $odsSearhVM")
        val result = null
        return ResponseEntity.ok().body(result)
    }
}
