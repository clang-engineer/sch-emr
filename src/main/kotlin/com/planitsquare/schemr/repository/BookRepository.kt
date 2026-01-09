package com.planitsquare.schemr.repository

import com.planitsquare.schemr.domain.Book
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

/**
 * Spring Data JPA repository for the Book entity.
 */
@Suppress("unused")
@Repository
interface BookRepository : JpaRepository<Book, Long>, JpaSpecificationExecutor<Book>
