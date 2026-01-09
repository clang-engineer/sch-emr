package com.planitsquare.schemr.service
import com.planitsquare.schemr.service.dto.BookDTO
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import java.util.Optional

/**
 * Service Interface for managing [com.planitsquare.schemr.domain.Book].
 */
interface BookService {

    /**
     * Save a book.
     *
     * @param bookDTO the entity to save.
     * @return the persisted entity.
     */
    fun save(bookDTO: BookDTO): BookDTO

    /**
     * Updates a book.
     *
     * @param bookDTO the entity to update.
     * @return the persisted entity.
     */
    fun update(bookDTO: BookDTO): BookDTO

    /**
     * Partially updates a book.
     *
     * @param bookDTO the entity to update partially.
     * @return the persisted entity.
     */
    fun partialUpdate(bookDTO: BookDTO): Optional<BookDTO>

    /**
     * Get all the books.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    fun findAll(pageable: Pageable): Page<BookDTO>

    /**
     * Get the "id" book.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    fun findOne(id: Long): Optional<BookDTO>

    /**
     * Delete the "id" book.
     *
     * @param id the id of the entity.
     */
    fun delete(id: Long)
}
