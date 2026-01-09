package com.planitsquare.schemr.service.mapper

import com.planitsquare.schemr.domain.Book
import com.planitsquare.schemr.service.dto.BookDTO
import org.mapstruct.*

/**
 * Mapper for the entity [Book] and its DTO [BookDTO].
 */
@Mapper(componentModel = "spring")
interface BookMapper :
    EntityMapper<BookDTO, Book>
