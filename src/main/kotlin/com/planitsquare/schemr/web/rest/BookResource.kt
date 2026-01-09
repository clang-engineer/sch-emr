package com.planitsquare.schemr.web.rest

import com.planitsquare.schemr.repository.BookRepository
import com.planitsquare.schemr.service.BookQueryService
import com.planitsquare.schemr.service.BookService
import com.planitsquare.schemr.service.criteria.BookCriteria
import com.planitsquare.schemr.service.dto.BookDTO
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

private const val ENTITY_NAME = "book"
/**
 * REST controller for managing [com.planitsquare.schemr.domain.Book].
 */
@RestController
@RequestMapping("/api")
class BookResource(
    private val bookService: BookService,
    private val bookRepository: BookRepository,
    private val bookQueryService: BookQueryService,
) {

    private val log = LoggerFactory.getLogger(javaClass)

    companion object {
        const val ENTITY_NAME = "book"
    }

    @Value("\${jhipster.clientApp.name}")
    private var applicationName: String? = null

    /**
     * `POST  /books` : Create a new book.
     *
     * @param bookDTO the bookDTO to create.
     * @return the [ResponseEntity] with status `201 (Created)` and with body the new bookDTO, or with status `400 (Bad Request)` if the book has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/books")
    fun createBook(@Valid @RequestBody bookDTO: BookDTO): ResponseEntity<BookDTO> {
        log.debug("REST request to save Book : $bookDTO")
        if (bookDTO.id != null) {
            throw BadRequestAlertException(
                "A new book cannot already have an ID",
                ENTITY_NAME, "idexists"
            )
        }
        val result = bookService.save(bookDTO)
        return ResponseEntity.created(URI("/api/books/${result.id}"))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.id.toString()))
            .body(result)
    }

    /**
     * {@code PUT  /books/:id} : Updates an existing book.
     *
     * @param id the id of the bookDTO to save.
     * @param bookDTO the bookDTO to update.
     * @return the [ResponseEntity] with status `200 (OK)` and with body the updated bookDTO,
     * or with status `400 (Bad Request)` if the bookDTO is not valid,
     * or with status `500 (Internal Server Error)` if the bookDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/books/{id}")
    fun updateBook(
        @PathVariable(value = "id", required = false) id: Long,
        @Valid @RequestBody bookDTO: BookDTO
    ): ResponseEntity<BookDTO> {
        log.debug("REST request to update Book : {}, {}", id, bookDTO)
        if (bookDTO.id == null) {
            throw BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull")
        }

        if (!Objects.equals(id, bookDTO.id)) {
            throw BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid")
        }

        if (!bookRepository.existsById(id)) {
            throw BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound")
        }

        val result = bookService.update(bookDTO)
        return ResponseEntity.ok()
            .headers(
                HeaderUtil.createEntityUpdateAlert(
                    applicationName, false, ENTITY_NAME,
                    bookDTO.id.toString()
                )
            )
            .body(result)
    }

    /**
     * {@code PATCH  /books/:id} : Partial updates given fields of an existing book, field will ignore if it is null
     *
     * @param id the id of the bookDTO to save.
     * @param bookDTO the bookDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bookDTO,
     * or with status {@code 400 (Bad Request)} if the bookDTO is not valid,
     * or with status {@code 404 (Not Found)} if the bookDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the bookDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = ["/books/{id}"], consumes = ["application/json", "application/merge-patch+json"])
    @Throws(URISyntaxException::class)
    fun partialUpdateBook(
        @PathVariable(value = "id", required = false) id: Long,
        @NotNull @RequestBody bookDTO: BookDTO
    ): ResponseEntity<BookDTO> {
        log.debug("REST request to partial update Book partially : {}, {}", id, bookDTO)
        if (bookDTO.id == null) {
            throw BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull")
        }
        if (!Objects.equals(id, bookDTO.id)) {
            throw BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid")
        }

        if (!bookRepository.existsById(id)) {
            throw BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound")
        }

        val result = bookService.partialUpdate(bookDTO)

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, bookDTO.id.toString())
        )
    }

    /**
     * `GET  /books` : get all the books.
     *
     * @param pageable the pagination information.

     * @param criteria the criteria which the requested entities should match.
     * @return the [ResponseEntity] with status `200 (OK)` and the list of books in body.
     */
    @GetMapping("/books") fun getAllBooks(
        criteria: BookCriteria,
        @org.springdoc.api.annotations.ParameterObject pageable: Pageable

    ): ResponseEntity<MutableList<BookDTO>> {
        log.debug("REST request to get Books by criteria: $criteria")
        val page = bookQueryService.findByCriteria(criteria, pageable)
        val headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page)
        return ResponseEntity.ok().headers(headers).body(page.content)
    }

    /**
     * `GET  /books/count}` : count all the books.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the [ResponseEntity] with status `200 (OK)` and the count in body.
     */
    @GetMapping("/books/count")
    fun countBooks(criteria: BookCriteria): ResponseEntity<Long> {
        log.debug("REST request to count Books by criteria: $criteria")
        return ResponseEntity.ok().body(bookQueryService.countByCriteria(criteria))
    }

    /**
     * `GET  /books/:id` : get the "id" book.
     *
     * @param id the id of the bookDTO to retrieve.
     * @return the [ResponseEntity] with status `200 (OK)` and with body the bookDTO, or with status `404 (Not Found)`.
     */
    @GetMapping("/books/{id}")
    fun getBook(@PathVariable id: Long): ResponseEntity<BookDTO> {
        log.debug("REST request to get Book : $id")
        val bookDTO = bookService.findOne(id)
        return ResponseUtil.wrapOrNotFound(bookDTO)
    }
    /**
     *  `DELETE  /books/:id` : delete the "id" book.
     *
     * @param id the id of the bookDTO to delete.
     * @return the [ResponseEntity] with status `204 (NO_CONTENT)`.
     */
    @DeleteMapping("/books/{id}")
    fun deleteBook(@PathVariable id: Long): ResponseEntity<Void> {
        log.debug("REST request to delete Book : $id")

        bookService.delete(id)
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build()
    }
}
