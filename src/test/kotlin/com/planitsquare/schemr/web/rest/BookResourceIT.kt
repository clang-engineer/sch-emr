package com.planitsquare.schemr.web.rest

import com.planitsquare.schemr.IntegrationTest
import com.planitsquare.schemr.domain.Book
import com.planitsquare.schemr.repository.BookRepository
import com.planitsquare.schemr.service.mapper.BookMapper
import org.assertj.core.api.Assertions.assertThat
import org.hamcrest.Matchers.hasItem
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.data.web.PageableHandlerMethodArgumentResolver
import org.springframework.http.MediaType
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import org.springframework.transaction.annotation.Transactional
import org.springframework.validation.Validator
import java.util.Random
import java.util.concurrent.atomic.AtomicLong
import javax.persistence.EntityManager
import kotlin.test.assertNotNull

/**
 * Integration tests for the [BookResource] REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BookResourceIT {
    @Autowired
    private lateinit var bookRepository: BookRepository

    @Autowired
    private lateinit var bookMapper: BookMapper

    @Autowired
    private lateinit var jacksonMessageConverter: MappingJackson2HttpMessageConverter

    @Autowired
    private lateinit var pageableArgumentResolver: PageableHandlerMethodArgumentResolver

    @Autowired
    private lateinit var validator: Validator

    @Autowired
    private lateinit var em: EntityManager

    @Autowired
    private lateinit var restBookMockMvc: MockMvc

    private lateinit var book: Book

    @BeforeEach
    fun initTest() {
        book = createEntity(em)
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun createBook() {
        val databaseSizeBeforeCreate = bookRepository.findAll().size
        // Create the Book
        val bookDTO = bookMapper.toDto(book)
        restBookMockMvc.perform(
            post(ENTITY_API_URL).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(convertObjectToJsonBytes(bookDTO))
        ).andExpect(status().isCreated)

        // Validate the Book in the database
        val bookList = bookRepository.findAll()
        assertThat(bookList).hasSize(databaseSizeBeforeCreate + 1)
        val testBook = bookList[bookList.size - 1]

        assertThat(testBook.title).isEqualTo(DEFAULT_TITLE)
        assertThat(testBook.description).isEqualTo(DEFAULT_DESCRIPTION)
        assertThat(testBook.activated).isEqualTo(DEFAULT_ACTIVATED)
        assertThat(testBook.orderNo).isEqualTo(DEFAULT_ORDER_NO)
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun createBookWithExistingId() {
        // Create the Book with an existing ID
        book.id = 1L
        val bookDTO = bookMapper.toDto(book)

        val databaseSizeBeforeCreate = bookRepository.findAll().size
        // An entity with an existing ID cannot be created, so this API call must fail
        restBookMockMvc.perform(
            post(ENTITY_API_URL).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(convertObjectToJsonBytes(bookDTO))
        ).andExpect(status().isBadRequest)

        // Validate the Book in the database
        val bookList = bookRepository.findAll()
        assertThat(bookList).hasSize(databaseSizeBeforeCreate)
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun checkTitleIsRequired() {
        val databaseSizeBeforeTest = bookRepository.findAll().size
        // set the field null
        book.title = null

        // Create the Book, which fails.
        val bookDTO = bookMapper.toDto(book)

        restBookMockMvc.perform(
            post(ENTITY_API_URL).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(convertObjectToJsonBytes(bookDTO))
        ).andExpect(status().isBadRequest)

        val bookList = bookRepository.findAll()
        assertThat(bookList).hasSize(databaseSizeBeforeTest)
    }
    @Test
    @Transactional
    @Throws(Exception::class)
    fun checkDescriptionIsRequired() {
        val databaseSizeBeforeTest = bookRepository.findAll().size
        // set the field null
        book.description = null

        // Create the Book, which fails.
        val bookDTO = bookMapper.toDto(book)

        restBookMockMvc.perform(
            post(ENTITY_API_URL).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(convertObjectToJsonBytes(bookDTO))
        ).andExpect(status().isBadRequest)

        val bookList = bookRepository.findAll()
        assertThat(bookList).hasSize(databaseSizeBeforeTest)
    }
    @Test
    @Transactional
    @Throws(Exception::class)
    fun checkActivatedIsRequired() {
        val databaseSizeBeforeTest = bookRepository.findAll().size
        // set the field null
        book.activated = null

        // Create the Book, which fails.
        val bookDTO = bookMapper.toDto(book)

        restBookMockMvc.perform(
            post(ENTITY_API_URL).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(convertObjectToJsonBytes(bookDTO))
        ).andExpect(status().isBadRequest)

        val bookList = bookRepository.findAll()
        assertThat(bookList).hasSize(databaseSizeBeforeTest)
    }
    @Test
    @Transactional
    @Throws(Exception::class)
    fun checkOrderNoIsRequired() {
        val databaseSizeBeforeTest = bookRepository.findAll().size
        // set the field null
        book.orderNo = null

        // Create the Book, which fails.
        val bookDTO = bookMapper.toDto(book)

        restBookMockMvc.perform(
            post(ENTITY_API_URL).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(convertObjectToJsonBytes(bookDTO))
        ).andExpect(status().isBadRequest)

        val bookList = bookRepository.findAll()
        assertThat(bookList).hasSize(databaseSizeBeforeTest)
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllBooks() {
        // Initialize the database
        bookRepository.saveAndFlush(book)

        // Get all the bookList
        restBookMockMvc.perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(book.id?.toInt())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].activated").value(hasItem(DEFAULT_ACTIVATED)))
            .andExpect(jsonPath("$.[*].orderNo").value(hasItem(DEFAULT_ORDER_NO)))
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getBook() {
        // Initialize the database
        bookRepository.saveAndFlush(book)

        val id = book.id
        assertNotNull(id)

        // Get the book
        restBookMockMvc.perform(get(ENTITY_API_URL_ID, book.id))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(book.id?.toInt()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.activated").value(DEFAULT_ACTIVATED))
            .andExpect(jsonPath("$.orderNo").value(DEFAULT_ORDER_NO))
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getBooksByIdFiltering() {
        // Initialize the database
        bookRepository.saveAndFlush(book)
        val id = book.id

        defaultBookShouldBeFound("id.equals=$id")
        defaultBookShouldNotBeFound("id.notEquals=$id")
        defaultBookShouldBeFound("id.greaterThanOrEqual=$id")
        defaultBookShouldNotBeFound("id.greaterThan=$id")

        defaultBookShouldBeFound("id.lessThanOrEqual=$id")
        defaultBookShouldNotBeFound("id.lessThan=$id")
    }
    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllBooksByTitleIsEqualToSomething() {
        // Initialize the database
        bookRepository.saveAndFlush(book)

        // Get all the bookList where title equals to DEFAULT_TITLE
        defaultBookShouldBeFound("title.equals=$DEFAULT_TITLE")

        // Get all the bookList where title equals to UPDATED_TITLE
        defaultBookShouldNotBeFound("title.equals=$UPDATED_TITLE")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllBooksByTitleIsInShouldWork() {
        // Initialize the database
        bookRepository.saveAndFlush(book)

        // Get all the bookList where title in DEFAULT_TITLE or UPDATED_TITLE
        defaultBookShouldBeFound("title.in=$DEFAULT_TITLE,$UPDATED_TITLE")

        // Get all the bookList where title equals to UPDATED_TITLE
        defaultBookShouldNotBeFound("title.in=$UPDATED_TITLE")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllBooksByTitleIsNullOrNotNull() {
        // Initialize the database
        bookRepository.saveAndFlush(book)

        // Get all the bookList where title is not null
        defaultBookShouldBeFound("title.specified=true")

        // Get all the bookList where title is null
        defaultBookShouldNotBeFound("title.specified=false")
    }
    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllBooksByTitleContainsSomething() {
        // Initialize the database
        bookRepository.saveAndFlush(book)

        // Get all the bookList where title contains DEFAULT_TITLE
        defaultBookShouldBeFound("title.contains=$DEFAULT_TITLE")

        // Get all the bookList where title contains UPDATED_TITLE
        defaultBookShouldNotBeFound("title.contains=$UPDATED_TITLE")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllBooksByTitleNotContainsSomething() {
        // Initialize the database
        bookRepository.saveAndFlush(book)

        // Get all the bookList where title does not contain DEFAULT_TITLE
        defaultBookShouldNotBeFound("title.doesNotContain=$DEFAULT_TITLE")

        // Get all the bookList where title does not contain UPDATED_TITLE
        defaultBookShouldBeFound("title.doesNotContain=$UPDATED_TITLE")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllBooksByDescriptionIsEqualToSomething() {
        // Initialize the database
        bookRepository.saveAndFlush(book)

        // Get all the bookList where description equals to DEFAULT_DESCRIPTION
        defaultBookShouldBeFound("description.equals=$DEFAULT_DESCRIPTION")

        // Get all the bookList where description equals to UPDATED_DESCRIPTION
        defaultBookShouldNotBeFound("description.equals=$UPDATED_DESCRIPTION")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllBooksByDescriptionIsInShouldWork() {
        // Initialize the database
        bookRepository.saveAndFlush(book)

        // Get all the bookList where description in DEFAULT_DESCRIPTION or UPDATED_DESCRIPTION
        defaultBookShouldBeFound("description.in=$DEFAULT_DESCRIPTION,$UPDATED_DESCRIPTION")

        // Get all the bookList where description equals to UPDATED_DESCRIPTION
        defaultBookShouldNotBeFound("description.in=$UPDATED_DESCRIPTION")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllBooksByDescriptionIsNullOrNotNull() {
        // Initialize the database
        bookRepository.saveAndFlush(book)

        // Get all the bookList where description is not null
        defaultBookShouldBeFound("description.specified=true")

        // Get all the bookList where description is null
        defaultBookShouldNotBeFound("description.specified=false")
    }
    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllBooksByDescriptionContainsSomething() {
        // Initialize the database
        bookRepository.saveAndFlush(book)

        // Get all the bookList where description contains DEFAULT_DESCRIPTION
        defaultBookShouldBeFound("description.contains=$DEFAULT_DESCRIPTION")

        // Get all the bookList where description contains UPDATED_DESCRIPTION
        defaultBookShouldNotBeFound("description.contains=$UPDATED_DESCRIPTION")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllBooksByDescriptionNotContainsSomething() {
        // Initialize the database
        bookRepository.saveAndFlush(book)

        // Get all the bookList where description does not contain DEFAULT_DESCRIPTION
        defaultBookShouldNotBeFound("description.doesNotContain=$DEFAULT_DESCRIPTION")

        // Get all the bookList where description does not contain UPDATED_DESCRIPTION
        defaultBookShouldBeFound("description.doesNotContain=$UPDATED_DESCRIPTION")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllBooksByActivatedIsEqualToSomething() {
        // Initialize the database
        bookRepository.saveAndFlush(book)

        // Get all the bookList where activated equals to DEFAULT_ACTIVATED
        defaultBookShouldBeFound("activated.equals=$DEFAULT_ACTIVATED")

        // Get all the bookList where activated equals to UPDATED_ACTIVATED
        defaultBookShouldNotBeFound("activated.equals=$UPDATED_ACTIVATED")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllBooksByActivatedIsInShouldWork() {
        // Initialize the database
        bookRepository.saveAndFlush(book)

        // Get all the bookList where activated in DEFAULT_ACTIVATED or UPDATED_ACTIVATED
        defaultBookShouldBeFound("activated.in=$DEFAULT_ACTIVATED,$UPDATED_ACTIVATED")

        // Get all the bookList where activated equals to UPDATED_ACTIVATED
        defaultBookShouldNotBeFound("activated.in=$UPDATED_ACTIVATED")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllBooksByActivatedIsNullOrNotNull() {
        // Initialize the database
        bookRepository.saveAndFlush(book)

        // Get all the bookList where activated is not null
        defaultBookShouldBeFound("activated.specified=true")

        // Get all the bookList where activated is null
        defaultBookShouldNotBeFound("activated.specified=false")
    }
    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllBooksByActivatedContainsSomething() {
        // Initialize the database
        bookRepository.saveAndFlush(book)

        // Get all the bookList where activated contains DEFAULT_ACTIVATED
        defaultBookShouldBeFound("activated.contains=$DEFAULT_ACTIVATED")

        // Get all the bookList where activated contains UPDATED_ACTIVATED
        defaultBookShouldNotBeFound("activated.contains=$UPDATED_ACTIVATED")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllBooksByActivatedNotContainsSomething() {
        // Initialize the database
        bookRepository.saveAndFlush(book)

        // Get all the bookList where activated does not contain DEFAULT_ACTIVATED
        defaultBookShouldNotBeFound("activated.doesNotContain=$DEFAULT_ACTIVATED")

        // Get all the bookList where activated does not contain UPDATED_ACTIVATED
        defaultBookShouldBeFound("activated.doesNotContain=$UPDATED_ACTIVATED")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllBooksByOrderNoIsEqualToSomething() {
        // Initialize the database
        bookRepository.saveAndFlush(book)

        // Get all the bookList where orderNo equals to DEFAULT_ORDER_NO
        defaultBookShouldBeFound("orderNo.equals=$DEFAULT_ORDER_NO")

        // Get all the bookList where orderNo equals to UPDATED_ORDER_NO
        defaultBookShouldNotBeFound("orderNo.equals=$UPDATED_ORDER_NO")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllBooksByOrderNoIsInShouldWork() {
        // Initialize the database
        bookRepository.saveAndFlush(book)

        // Get all the bookList where orderNo in DEFAULT_ORDER_NO or UPDATED_ORDER_NO
        defaultBookShouldBeFound("orderNo.in=$DEFAULT_ORDER_NO,$UPDATED_ORDER_NO")

        // Get all the bookList where orderNo equals to UPDATED_ORDER_NO
        defaultBookShouldNotBeFound("orderNo.in=$UPDATED_ORDER_NO")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllBooksByOrderNoIsNullOrNotNull() {
        // Initialize the database
        bookRepository.saveAndFlush(book)

        // Get all the bookList where orderNo is not null
        defaultBookShouldBeFound("orderNo.specified=true")

        // Get all the bookList where orderNo is null
        defaultBookShouldNotBeFound("orderNo.specified=false")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllBooksByOrderNoIsGreaterThanOrEqualToSomething() {
        // Initialize the database
        bookRepository.saveAndFlush(book)

        // Get all the bookList where orderNo is greater than or equal to DEFAULT_ORDER_NO
        defaultBookShouldBeFound("orderNo.greaterThanOrEqual=$DEFAULT_ORDER_NO")

        // Get all the bookList where orderNo is greater than or equal to UPDATED_ORDER_NO
        defaultBookShouldNotBeFound("orderNo.greaterThanOrEqual=$UPDATED_ORDER_NO")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllBooksByOrderNoIsLessThanOrEqualToSomething() {
        // Initialize the database
        bookRepository.saveAndFlush(book)

        // Get all the bookList where orderNo is less than or equal to DEFAULT_ORDER_NO
        defaultBookShouldBeFound("orderNo.lessThanOrEqual=$DEFAULT_ORDER_NO")

        // Get all the bookList where orderNo is less than or equal to SMALLER_ORDER_NO
        defaultBookShouldNotBeFound("orderNo.lessThanOrEqual=$SMALLER_ORDER_NO")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllBooksByOrderNoIsLessThanSomething() {
        // Initialize the database
        bookRepository.saveAndFlush(book)

        // Get all the bookList where orderNo is less than DEFAULT_ORDER_NO
        defaultBookShouldNotBeFound("orderNo.lessThan=$DEFAULT_ORDER_NO")

        // Get all the bookList where orderNo is less than UPDATED_ORDER_NO
        defaultBookShouldBeFound("orderNo.lessThan=$UPDATED_ORDER_NO")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllBooksByOrderNoIsGreaterThanSomething() {
        // Initialize the database
        bookRepository.saveAndFlush(book)

        // Get all the bookList where orderNo is greater than DEFAULT_ORDER_NO
        defaultBookShouldNotBeFound("orderNo.greaterThan=$DEFAULT_ORDER_NO")

        // Get all the bookList where orderNo is greater than SMALLER_ORDER_NO
        defaultBookShouldBeFound("orderNo.greaterThan=$SMALLER_ORDER_NO")
    }

    /**
     * Executes the search, and checks that the default entity is returned
     */

    @Throws(Exception::class)
    private fun defaultBookShouldBeFound(filter: String) {
        restBookMockMvc.perform(get(ENTITY_API_URL + "?sort=id,desc&$filter"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(book.id?.toInt())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].activated").value(hasItem(DEFAULT_ACTIVATED)))
            .andExpect(jsonPath("$.[*].orderNo").value(hasItem(DEFAULT_ORDER_NO)))

        // Check, that the count call also returns 1
        restBookMockMvc.perform(get(ENTITY_API_URL + "/count?sort=id,desc&$filter"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"))
    }

    /**
     * Executes the search, and checks that the default entity is not returned
     */
    @Throws(Exception::class)
    private fun defaultBookShouldNotBeFound(filter: String) {
        restBookMockMvc.perform(get(ENTITY_API_URL + "?sort=id,desc&$filter"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray)
            .andExpect(jsonPath("$").isEmpty)

        // Check, that the count call also returns 0
        restBookMockMvc.perform(get(ENTITY_API_URL + "/count?sort=id,desc&$filter"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"))
    }
    @Test
    @Transactional
    @Throws(Exception::class)
    fun getNonExistingBook() {
        // Get the book
        restBookMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE))
            .andExpect(status().isNotFound)
    }
    @Test
    @Transactional
    fun putExistingBook() {
        // Initialize the database
        bookRepository.saveAndFlush(book)

        val databaseSizeBeforeUpdate = bookRepository.findAll().size

        // Update the book
        val updatedBook = bookRepository.findById(book.id).get()
        // Disconnect from session so that the updates on updatedBook are not directly saved in db
        em.detach(updatedBook)
        updatedBook.title = UPDATED_TITLE
        updatedBook.description = UPDATED_DESCRIPTION
        updatedBook.activated = UPDATED_ACTIVATED
        updatedBook.orderNo = UPDATED_ORDER_NO
        val bookDTO = bookMapper.toDto(updatedBook)

        restBookMockMvc.perform(
            put(ENTITY_API_URL_ID, bookDTO.id).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(convertObjectToJsonBytes(bookDTO))
        ).andExpect(status().isOk)

        // Validate the Book in the database
        val bookList = bookRepository.findAll()
        assertThat(bookList).hasSize(databaseSizeBeforeUpdate)
        val testBook = bookList[bookList.size - 1]
        assertThat(testBook.title).isEqualTo(UPDATED_TITLE)
        assertThat(testBook.description).isEqualTo(UPDATED_DESCRIPTION)
        assertThat(testBook.activated).isEqualTo(UPDATED_ACTIVATED)
        assertThat(testBook.orderNo).isEqualTo(UPDATED_ORDER_NO)
    }

    @Test
    @Transactional
    fun putNonExistingBook() {
        val databaseSizeBeforeUpdate = bookRepository.findAll().size
        book.id = count.incrementAndGet()

        // Create the Book
        val bookDTO = bookMapper.toDto(book)

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBookMockMvc.perform(
            put(ENTITY_API_URL_ID, bookDTO.id).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(convertObjectToJsonBytes(bookDTO))
        )
            .andExpect(status().isBadRequest)

        // Validate the Book in the database
        val bookList = bookRepository.findAll()
        assertThat(bookList).hasSize(databaseSizeBeforeUpdate)
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun putWithIdMismatchBook() {
        val databaseSizeBeforeUpdate = bookRepository.findAll().size
        book.id = count.incrementAndGet()

        // Create the Book
        val bookDTO = bookMapper.toDto(book)

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookMockMvc.perform(
            put(ENTITY_API_URL_ID, count.incrementAndGet()).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(convertObjectToJsonBytes(bookDTO))
        ).andExpect(status().isBadRequest)

        // Validate the Book in the database
        val bookList = bookRepository.findAll()
        assertThat(bookList).hasSize(databaseSizeBeforeUpdate)
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun putWithMissingIdPathParamBook() {
        val databaseSizeBeforeUpdate = bookRepository.findAll().size
        book.id = count.incrementAndGet()

        // Create the Book
        val bookDTO = bookMapper.toDto(book)

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookMockMvc.perform(
            put(ENTITY_API_URL).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(convertObjectToJsonBytes(bookDTO))
        )
            .andExpect(status().isMethodNotAllowed)

        // Validate the Book in the database
        val bookList = bookRepository.findAll()
        assertThat(bookList).hasSize(databaseSizeBeforeUpdate)
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun partialUpdateBookWithPatch() {
        bookRepository.saveAndFlush(book)

        val databaseSizeBeforeUpdate = bookRepository.findAll().size

// Update the book using partial update
        val partialUpdatedBook = Book().apply {
            id = book.id

            title = UPDATED_TITLE
            description = UPDATED_DESCRIPTION
        }

        restBookMockMvc.perform(
            patch(ENTITY_API_URL_ID, partialUpdatedBook.id).with(csrf())
                .contentType("application/merge-patch+json")
                .content(convertObjectToJsonBytes(partialUpdatedBook))
        )
            .andExpect(status().isOk)

// Validate the Book in the database
        val bookList = bookRepository.findAll()
        assertThat(bookList).hasSize(databaseSizeBeforeUpdate)
        val testBook = bookList.last()
        assertThat(testBook.title).isEqualTo(UPDATED_TITLE)
        assertThat(testBook.description).isEqualTo(UPDATED_DESCRIPTION)
        assertThat(testBook.activated).isEqualTo(DEFAULT_ACTIVATED)
        assertThat(testBook.orderNo).isEqualTo(DEFAULT_ORDER_NO)
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun fullUpdateBookWithPatch() {
        bookRepository.saveAndFlush(book)

        val databaseSizeBeforeUpdate = bookRepository.findAll().size

// Update the book using partial update
        val partialUpdatedBook = Book().apply {
            id = book.id

            title = UPDATED_TITLE
            description = UPDATED_DESCRIPTION
            activated = UPDATED_ACTIVATED
            orderNo = UPDATED_ORDER_NO
        }

        restBookMockMvc.perform(
            patch(ENTITY_API_URL_ID, partialUpdatedBook.id).with(csrf())
                .contentType("application/merge-patch+json")
                .content(convertObjectToJsonBytes(partialUpdatedBook))
        )
            .andExpect(status().isOk)

// Validate the Book in the database
        val bookList = bookRepository.findAll()
        assertThat(bookList).hasSize(databaseSizeBeforeUpdate)
        val testBook = bookList.last()
        assertThat(testBook.title).isEqualTo(UPDATED_TITLE)
        assertThat(testBook.description).isEqualTo(UPDATED_DESCRIPTION)
        assertThat(testBook.activated).isEqualTo(UPDATED_ACTIVATED)
        assertThat(testBook.orderNo).isEqualTo(UPDATED_ORDER_NO)
    }

    @Throws(Exception::class)
    fun patchNonExistingBook() {
        val databaseSizeBeforeUpdate = bookRepository.findAll().size
        book.id = count.incrementAndGet()

        // Create the Book
        val bookDTO = bookMapper.toDto(book)

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBookMockMvc.perform(
            patch(ENTITY_API_URL_ID, bookDTO.id).with(csrf())
                .contentType("application/merge-patch+json")
                .content(convertObjectToJsonBytes(bookDTO))
        )
            .andExpect(status().isBadRequest)

        // Validate the Book in the database
        val bookList = bookRepository.findAll()
        assertThat(bookList).hasSize(databaseSizeBeforeUpdate)
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun patchWithIdMismatchBook() {
        val databaseSizeBeforeUpdate = bookRepository.findAll().size
        book.id = count.incrementAndGet()

        // Create the Book
        val bookDTO = bookMapper.toDto(book)

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookMockMvc.perform(
            patch(ENTITY_API_URL_ID, count.incrementAndGet()).with(csrf())
                .contentType("application/merge-patch+json")
                .content(convertObjectToJsonBytes(bookDTO))
        )
            .andExpect(status().isBadRequest)

        // Validate the Book in the database
        val bookList = bookRepository.findAll()
        assertThat(bookList).hasSize(databaseSizeBeforeUpdate)
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun patchWithMissingIdPathParamBook() {
        val databaseSizeBeforeUpdate = bookRepository.findAll().size
        book.id = count.incrementAndGet()

        // Create the Book
        val bookDTO = bookMapper.toDto(book)

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookMockMvc.perform(
            patch(ENTITY_API_URL).with(csrf())
                .contentType("application/merge-patch+json")
                .content(convertObjectToJsonBytes(bookDTO))
        )
            .andExpect(status().isMethodNotAllowed)

        // Validate the Book in the database
        val bookList = bookRepository.findAll()
        assertThat(bookList).hasSize(databaseSizeBeforeUpdate)
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun deleteBook() {
        // Initialize the database
        bookRepository.saveAndFlush(book)
        val databaseSizeBeforeDelete = bookRepository.findAll().size
        // Delete the book
        restBookMockMvc.perform(
            delete(ENTITY_API_URL_ID, book.id).with(csrf())
                .accept(MediaType.APPLICATION_JSON)
        ).andExpect(status().isNoContent)

        // Validate the database contains one less item
        val bookList = bookRepository.findAll()
        assertThat(bookList).hasSize(databaseSizeBeforeDelete - 1)
    }

    companion object {

        private const val DEFAULT_TITLE = "AAAAAAAAAA"
        private const val UPDATED_TITLE = "BBBBBBBBBB"

        private const val DEFAULT_DESCRIPTION = "AAAAAAAAAA"
        private const val UPDATED_DESCRIPTION = "BBBBBBBBBB"

        private const val DEFAULT_ACTIVATED = "AAAAAAAAAA"
        private const val UPDATED_ACTIVATED = "BBBBBBBBBB"

        private const val DEFAULT_ORDER_NO: Int = 1
        private const val UPDATED_ORDER_NO: Int = 2
        private const val SMALLER_ORDER_NO: Int = 1 - 1

        private val ENTITY_API_URL: String = "/api/books"
        private val ENTITY_API_URL_ID: String = ENTITY_API_URL + "/{id}"

        private val random: Random = Random()
        private val count: AtomicLong = AtomicLong(random.nextInt().toLong() + (2 * Integer.MAX_VALUE))

        /**
         * Create an entity for this test.
         *
         * This is a static method, as tests for other entities might also need it,
         * if they test an entity which requires the current entity.
         */
        @JvmStatic
        fun createEntity(em: EntityManager): Book {
            val book = Book(
                title = DEFAULT_TITLE,

                description = DEFAULT_DESCRIPTION,

                activated = DEFAULT_ACTIVATED,

                orderNo = DEFAULT_ORDER_NO

            )

            return book
        }

        /**
         * Create an updated entity for this test.
         *
         * This is a static method, as tests for other entities might also need it,
         * if they test an entity which requires the current entity.
         */
        @JvmStatic
        fun createUpdatedEntity(em: EntityManager): Book {
            val book = Book(
                title = UPDATED_TITLE,

                description = UPDATED_DESCRIPTION,

                activated = UPDATED_ACTIVATED,

                orderNo = UPDATED_ORDER_NO

            )

            return book
        }
    }
}
