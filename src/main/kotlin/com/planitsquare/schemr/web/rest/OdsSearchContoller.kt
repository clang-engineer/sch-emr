package com.planitsquare.schemr.web.rest

import com.planitsquare.schemr.service.OdsSearchService
import com.planitsquare.schemr.web.rest.vm.OdsSearchVM
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException
import javax.validation.Valid

@RestController
@RequestMapping("/api")
class OdsSearchController(private val odsSearchService: OdsSearchService) {

    private val log = LoggerFactory.getLogger(javaClass)

    @PostMapping("/ods")
    fun search(@Valid @RequestBody odsSearchVM: OdsSearchVM): ResponseEntity<List<Map<String, Any>>> {
        log.debug("REST request to search ODS: $odsSearchVM")

        val title = odsSearchVM.key
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "key is required")

        val params = odsSearchVM.map ?: emptyMap()

        return try {
            val result = odsSearchService.executeQuery(title, params)
            ResponseEntity.ok().body(result)
        } catch (e: IllegalArgumentException) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, e.message, e)
        } catch (e: IllegalStateException) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, e.message, e)
        }
    }
}
