package com.planitsquare.schemr.service.impl

import com.planitsquare.schemr.domain.Book
import com.planitsquare.schemr.repository.BookRepository
import com.planitsquare.schemr.service.BookService
import com.planitsquare.schemr.service.dto.BookDTO
import com.planitsquare.schemr.service.mapper.BookMapper
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.Optional

/**
 * Service Implementation for managing [Book].
 */
@Service
@Transactional
class BookServiceImpl(
    private val bookRepository: BookRepository,
    private val bookMapper: BookMapper,
) : BookService {

    private val log = LoggerFactory.getLogger(javaClass)

    override fun save(bookDTO: BookDTO): BookDTO {
        log.debug("Request to save Book : $bookDTO")
        var book = bookMapper.toEntity(bookDTO)
        book = bookRepository.save(book)
        return bookMapper.toDto(book)
    }

    override fun update(bookDTO: BookDTO): BookDTO {
        log.debug("Request to update Book : {}", bookDTO)
        var book = bookMapper.toEntity(bookDTO)
        book = bookRepository.save(book)
        return bookMapper.toDto(book)
    }

    override fun partialUpdate(bookDTO: BookDTO): Optional<BookDTO> {
        log.debug("Request to partially update Book : {}", bookDTO)

        return bookRepository.findById(bookDTO.id)
            .map {
                bookMapper.partialUpdate(it, bookDTO)
                it
            }
            .map { bookRepository.save(it) }
            .map { bookMapper.toDto(it) }
    }

    @Transactional(readOnly = true)
    override fun findAll(pageable: Pageable): Page<BookDTO> {
        log.debug("Request to get all Books")
        return bookRepository.findAll(pageable)
            .map(bookMapper::toDto)
    }

    @Transactional(readOnly = true)
    override fun findOne(id: Long): Optional<BookDTO> {
        log.debug("Request to get Book : $id")
        return bookRepository.findById(id)
            .map(bookMapper::toDto)
    }

    override fun delete(id: Long) {
        log.debug("Request to delete Book : $id")

        bookRepository.deleteById(id)
    }
}
