package com.planitsquare.schemr.web.rest

import com.planitsquare.schemr.IntegrationTest
import com.planitsquare.schemr.domain.Sql
import com.planitsquare.schemr.repository.SqlRepository
import com.planitsquare.schemr.service.mapper.SqlMapper
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
 * Integration tests for the [SqlResource] REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SqlResourceIT {
    @Autowired
    private lateinit var sqlRepository: SqlRepository

    @Autowired
    private lateinit var sqlMapper: SqlMapper

    @Autowired
    private lateinit var jacksonMessageConverter: MappingJackson2HttpMessageConverter

    @Autowired
    private lateinit var pageableArgumentResolver: PageableHandlerMethodArgumentResolver

    @Autowired
    private lateinit var validator: Validator

    @Autowired
    private lateinit var em: EntityManager

    @Autowired
    private lateinit var restSqlMockMvc: MockMvc

    private lateinit var sql: Sql

    @BeforeEach
    fun initTest() {
        sql = createEntity(em)
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun createSql() {
        val databaseSizeBeforeCreate = sqlRepository.findAll().size
        // Create the Sql
        val sqlDTO = sqlMapper.toDto(sql)
        restSqlMockMvc.perform(
            post(ENTITY_API_URL).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(convertObjectToJsonBytes(sqlDTO))
        ).andExpect(status().isCreated)

        // Validate the Sql in the database
        val sqlList = sqlRepository.findAll()
        assertThat(sqlList).hasSize(databaseSizeBeforeCreate + 1)
        val testSql = sqlList[sqlList.size - 1]

        assertThat(testSql.title).isEqualTo(DEFAULT_TITLE)
        assertThat(testSql.description).isEqualTo(DEFAULT_DESCRIPTION)
        assertThat(testSql.activated).isEqualTo(DEFAULT_ACTIVATED)
        assertThat(testSql.orderNo).isEqualTo(DEFAULT_ORDER_NO)
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun createSqlWithExistingId() {
        // Create the Sql with an existing ID
        sql.id = 1L
        val sqlDTO = sqlMapper.toDto(sql)

        val databaseSizeBeforeCreate = sqlRepository.findAll().size
        // An entity with an existing ID cannot be created, so this API call must fail
        restSqlMockMvc.perform(
            post(ENTITY_API_URL).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(convertObjectToJsonBytes(sqlDTO))
        ).andExpect(status().isBadRequest)

        // Validate the Sql in the database
        val sqlList = sqlRepository.findAll()
        assertThat(sqlList).hasSize(databaseSizeBeforeCreate)
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun checkTitleIsRequired() {
        val databaseSizeBeforeTest = sqlRepository.findAll().size
        // set the field null
        sql.title = null

        // Create the Sql, which fails.
        val sqlDTO = sqlMapper.toDto(sql)

        restSqlMockMvc.perform(
            post(ENTITY_API_URL).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(convertObjectToJsonBytes(sqlDTO))
        ).andExpect(status().isBadRequest)

        val sqlList = sqlRepository.findAll()
        assertThat(sqlList).hasSize(databaseSizeBeforeTest)
    }
    @Test
    @Transactional
    @Throws(Exception::class)
    fun checkDescriptionIsRequired() {
        val databaseSizeBeforeTest = sqlRepository.findAll().size
        // set the field null
        sql.description = null

        // Create the Sql, which fails.
        val sqlDTO = sqlMapper.toDto(sql)

        restSqlMockMvc.perform(
            post(ENTITY_API_URL).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(convertObjectToJsonBytes(sqlDTO))
        ).andExpect(status().isBadRequest)

        val sqlList = sqlRepository.findAll()
        assertThat(sqlList).hasSize(databaseSizeBeforeTest)
    }
    @Test
    @Transactional
    @Throws(Exception::class)
    fun checkActivatedIsRequired() {
        val databaseSizeBeforeTest = sqlRepository.findAll().size
        // set the field null
        sql.activated = null

        // Create the Sql, which fails.
        val sqlDTO = sqlMapper.toDto(sql)

        restSqlMockMvc.perform(
            post(ENTITY_API_URL).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(convertObjectToJsonBytes(sqlDTO))
        ).andExpect(status().isBadRequest)

        val sqlList = sqlRepository.findAll()
        assertThat(sqlList).hasSize(databaseSizeBeforeTest)
    }
    @Test
    @Transactional
    @Throws(Exception::class)
    fun checkOrderNoIsRequired() {
        val databaseSizeBeforeTest = sqlRepository.findAll().size
        // set the field null
        sql.orderNo = null

        // Create the Sql, which fails.
        val sqlDTO = sqlMapper.toDto(sql)

        restSqlMockMvc.perform(
            post(ENTITY_API_URL).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(convertObjectToJsonBytes(sqlDTO))
        ).andExpect(status().isBadRequest)

        val sqlList = sqlRepository.findAll()
        assertThat(sqlList).hasSize(databaseSizeBeforeTest)
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllSqls() {
        // Initialize the database
        sqlRepository.saveAndFlush(sql)

        // Get all the sqlList
        restSqlMockMvc.perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sql.id?.toInt())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].activated").value(hasItem(DEFAULT_ACTIVATED)))
            .andExpect(jsonPath("$.[*].orderNo").value(hasItem(DEFAULT_ORDER_NO)))
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getSql() {
        // Initialize the database
        sqlRepository.saveAndFlush(sql)

        val id = sql.id
        assertNotNull(id)

        // Get the sql
        restSqlMockMvc.perform(get(ENTITY_API_URL_ID, sql.id))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sql.id?.toInt()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.activated").value(DEFAULT_ACTIVATED))
            .andExpect(jsonPath("$.orderNo").value(DEFAULT_ORDER_NO))
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getSqlsByIdFiltering() {
        // Initialize the database
        sqlRepository.saveAndFlush(sql)
        val id = sql.id

        defaultSqlShouldBeFound("id.equals=$id")
        defaultSqlShouldNotBeFound("id.notEquals=$id")
        defaultSqlShouldBeFound("id.greaterThanOrEqual=$id")
        defaultSqlShouldNotBeFound("id.greaterThan=$id")

        defaultSqlShouldBeFound("id.lessThanOrEqual=$id")
        defaultSqlShouldNotBeFound("id.lessThan=$id")
    }
    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllSqlsByTitleIsEqualToSomething() {
        // Initialize the database
        sqlRepository.saveAndFlush(sql)

        // Get all the sqlList where title equals to DEFAULT_TITLE
        defaultSqlShouldBeFound("title.equals=$DEFAULT_TITLE")

        // Get all the sqlList where title equals to UPDATED_TITLE
        defaultSqlShouldNotBeFound("title.equals=$UPDATED_TITLE")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllSqlsByTitleIsInShouldWork() {
        // Initialize the database
        sqlRepository.saveAndFlush(sql)

        // Get all the sqlList where title in DEFAULT_TITLE or UPDATED_TITLE
        defaultSqlShouldBeFound("title.in=$DEFAULT_TITLE,$UPDATED_TITLE")

        // Get all the sqlList where title equals to UPDATED_TITLE
        defaultSqlShouldNotBeFound("title.in=$UPDATED_TITLE")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllSqlsByTitleIsNullOrNotNull() {
        // Initialize the database
        sqlRepository.saveAndFlush(sql)

        // Get all the sqlList where title is not null
        defaultSqlShouldBeFound("title.specified=true")

        // Get all the sqlList where title is null
        defaultSqlShouldNotBeFound("title.specified=false")
    }
    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllSqlsByTitleContainsSomething() {
        // Initialize the database
        sqlRepository.saveAndFlush(sql)

        // Get all the sqlList where title contains DEFAULT_TITLE
        defaultSqlShouldBeFound("title.contains=$DEFAULT_TITLE")

        // Get all the sqlList where title contains UPDATED_TITLE
        defaultSqlShouldNotBeFound("title.contains=$UPDATED_TITLE")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllSqlsByTitleNotContainsSomething() {
        // Initialize the database
        sqlRepository.saveAndFlush(sql)

        // Get all the sqlList where title does not contain DEFAULT_TITLE
        defaultSqlShouldNotBeFound("title.doesNotContain=$DEFAULT_TITLE")

        // Get all the sqlList where title does not contain UPDATED_TITLE
        defaultSqlShouldBeFound("title.doesNotContain=$UPDATED_TITLE")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllSqlsByDescriptionIsEqualToSomething() {
        // Initialize the database
        sqlRepository.saveAndFlush(sql)

        // Get all the sqlList where description equals to DEFAULT_DESCRIPTION
        defaultSqlShouldBeFound("description.equals=$DEFAULT_DESCRIPTION")

        // Get all the sqlList where description equals to UPDATED_DESCRIPTION
        defaultSqlShouldNotBeFound("description.equals=$UPDATED_DESCRIPTION")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllSqlsByDescriptionIsInShouldWork() {
        // Initialize the database
        sqlRepository.saveAndFlush(sql)

        // Get all the sqlList where description in DEFAULT_DESCRIPTION or UPDATED_DESCRIPTION
        defaultSqlShouldBeFound("description.in=$DEFAULT_DESCRIPTION,$UPDATED_DESCRIPTION")

        // Get all the sqlList where description equals to UPDATED_DESCRIPTION
        defaultSqlShouldNotBeFound("description.in=$UPDATED_DESCRIPTION")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllSqlsByDescriptionIsNullOrNotNull() {
        // Initialize the database
        sqlRepository.saveAndFlush(sql)

        // Get all the sqlList where description is not null
        defaultSqlShouldBeFound("description.specified=true")

        // Get all the sqlList where description is null
        defaultSqlShouldNotBeFound("description.specified=false")
    }
    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllSqlsByDescriptionContainsSomething() {
        // Initialize the database
        sqlRepository.saveAndFlush(sql)

        // Get all the sqlList where description contains DEFAULT_DESCRIPTION
        defaultSqlShouldBeFound("description.contains=$DEFAULT_DESCRIPTION")

        // Get all the sqlList where description contains UPDATED_DESCRIPTION
        defaultSqlShouldNotBeFound("description.contains=$UPDATED_DESCRIPTION")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllSqlsByDescriptionNotContainsSomething() {
        // Initialize the database
        sqlRepository.saveAndFlush(sql)

        // Get all the sqlList where description does not contain DEFAULT_DESCRIPTION
        defaultSqlShouldNotBeFound("description.doesNotContain=$DEFAULT_DESCRIPTION")

        // Get all the sqlList where description does not contain UPDATED_DESCRIPTION
        defaultSqlShouldBeFound("description.doesNotContain=$UPDATED_DESCRIPTION")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllSqlsByActivatedIsEqualToSomething() {
        // Initialize the database
        sqlRepository.saveAndFlush(sql)

        // Get all the sqlList where activated equals to DEFAULT_ACTIVATED
        defaultSqlShouldBeFound("activated.equals=$DEFAULT_ACTIVATED")

        // Get all the sqlList where activated equals to UPDATED_ACTIVATED
        defaultSqlShouldNotBeFound("activated.equals=$UPDATED_ACTIVATED")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllSqlsByActivatedIsInShouldWork() {
        // Initialize the database
        sqlRepository.saveAndFlush(sql)

        // Get all the sqlList where activated in DEFAULT_ACTIVATED or UPDATED_ACTIVATED
        defaultSqlShouldBeFound("activated.in=$DEFAULT_ACTIVATED,$UPDATED_ACTIVATED")

        // Get all the sqlList where activated equals to UPDATED_ACTIVATED
        defaultSqlShouldNotBeFound("activated.in=$UPDATED_ACTIVATED")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllSqlsByActivatedIsNullOrNotNull() {
        // Initialize the database
        sqlRepository.saveAndFlush(sql)

        // Get all the sqlList where activated is not null
        defaultSqlShouldBeFound("activated.specified=true")

        // Get all the sqlList where activated is null
        defaultSqlShouldNotBeFound("activated.specified=false")
    }
    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllSqlsByActivatedContainsSomething() {
        // Initialize the database
        sqlRepository.saveAndFlush(sql)

        // Get all the sqlList where activated contains DEFAULT_ACTIVATED
        defaultSqlShouldBeFound("activated.contains=$DEFAULT_ACTIVATED")

        // Get all the sqlList where activated contains UPDATED_ACTIVATED
        defaultSqlShouldNotBeFound("activated.contains=$UPDATED_ACTIVATED")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllSqlsByActivatedNotContainsSomething() {
        // Initialize the database
        sqlRepository.saveAndFlush(sql)

        // Get all the sqlList where activated does not contain DEFAULT_ACTIVATED
        defaultSqlShouldNotBeFound("activated.doesNotContain=$DEFAULT_ACTIVATED")

        // Get all the sqlList where activated does not contain UPDATED_ACTIVATED
        defaultSqlShouldBeFound("activated.doesNotContain=$UPDATED_ACTIVATED")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllSqlsByOrderNoIsEqualToSomething() {
        // Initialize the database
        sqlRepository.saveAndFlush(sql)

        // Get all the sqlList where orderNo equals to DEFAULT_ORDER_NO
        defaultSqlShouldBeFound("orderNo.equals=$DEFAULT_ORDER_NO")

        // Get all the sqlList where orderNo equals to UPDATED_ORDER_NO
        defaultSqlShouldNotBeFound("orderNo.equals=$UPDATED_ORDER_NO")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllSqlsByOrderNoIsInShouldWork() {
        // Initialize the database
        sqlRepository.saveAndFlush(sql)

        // Get all the sqlList where orderNo in DEFAULT_ORDER_NO or UPDATED_ORDER_NO
        defaultSqlShouldBeFound("orderNo.in=$DEFAULT_ORDER_NO,$UPDATED_ORDER_NO")

        // Get all the sqlList where orderNo equals to UPDATED_ORDER_NO
        defaultSqlShouldNotBeFound("orderNo.in=$UPDATED_ORDER_NO")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllSqlsByOrderNoIsNullOrNotNull() {
        // Initialize the database
        sqlRepository.saveAndFlush(sql)

        // Get all the sqlList where orderNo is not null
        defaultSqlShouldBeFound("orderNo.specified=true")

        // Get all the sqlList where orderNo is null
        defaultSqlShouldNotBeFound("orderNo.specified=false")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllSqlsByOrderNoIsGreaterThanOrEqualToSomething() {
        // Initialize the database
        sqlRepository.saveAndFlush(sql)

        // Get all the sqlList where orderNo is greater than or equal to DEFAULT_ORDER_NO
        defaultSqlShouldBeFound("orderNo.greaterThanOrEqual=$DEFAULT_ORDER_NO")

        // Get all the sqlList where orderNo is greater than or equal to UPDATED_ORDER_NO
        defaultSqlShouldNotBeFound("orderNo.greaterThanOrEqual=$UPDATED_ORDER_NO")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllSqlsByOrderNoIsLessThanOrEqualToSomething() {
        // Initialize the database
        sqlRepository.saveAndFlush(sql)

        // Get all the sqlList where orderNo is less than or equal to DEFAULT_ORDER_NO
        defaultSqlShouldBeFound("orderNo.lessThanOrEqual=$DEFAULT_ORDER_NO")

        // Get all the sqlList where orderNo is less than or equal to SMALLER_ORDER_NO
        defaultSqlShouldNotBeFound("orderNo.lessThanOrEqual=$SMALLER_ORDER_NO")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllSqlsByOrderNoIsLessThanSomething() {
        // Initialize the database
        sqlRepository.saveAndFlush(sql)

        // Get all the sqlList where orderNo is less than DEFAULT_ORDER_NO
        defaultSqlShouldNotBeFound("orderNo.lessThan=$DEFAULT_ORDER_NO")

        // Get all the sqlList where orderNo is less than UPDATED_ORDER_NO
        defaultSqlShouldBeFound("orderNo.lessThan=$UPDATED_ORDER_NO")
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun getAllSqlsByOrderNoIsGreaterThanSomething() {
        // Initialize the database
        sqlRepository.saveAndFlush(sql)

        // Get all the sqlList where orderNo is greater than DEFAULT_ORDER_NO
        defaultSqlShouldNotBeFound("orderNo.greaterThan=$DEFAULT_ORDER_NO")

        // Get all the sqlList where orderNo is greater than SMALLER_ORDER_NO
        defaultSqlShouldBeFound("orderNo.greaterThan=$SMALLER_ORDER_NO")
    }

    /**
     * Executes the search, and checks that the default entity is returned
     */

    @Throws(Exception::class)
    private fun defaultSqlShouldBeFound(filter: String) {
        restSqlMockMvc.perform(get(ENTITY_API_URL + "?sort=id,desc&$filter"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sql.id?.toInt())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].activated").value(hasItem(DEFAULT_ACTIVATED)))
            .andExpect(jsonPath("$.[*].orderNo").value(hasItem(DEFAULT_ORDER_NO)))

        // Check, that the count call also returns 1
        restSqlMockMvc.perform(get(ENTITY_API_URL + "/count?sort=id,desc&$filter"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"))
    }

    /**
     * Executes the search, and checks that the default entity is not returned
     */
    @Throws(Exception::class)
    private fun defaultSqlShouldNotBeFound(filter: String) {
        restSqlMockMvc.perform(get(ENTITY_API_URL + "?sort=id,desc&$filter"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray)
            .andExpect(jsonPath("$").isEmpty)

        // Check, that the count call also returns 0
        restSqlMockMvc.perform(get(ENTITY_API_URL + "/count?sort=id,desc&$filter"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"))
    }
    @Test
    @Transactional
    @Throws(Exception::class)
    fun getNonExistingSql() {
        // Get the sql
        restSqlMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE))
            .andExpect(status().isNotFound)
    }
    @Test
    @Transactional
    fun putExistingSql() {
        // Initialize the database
        sqlRepository.saveAndFlush(sql)

        val databaseSizeBeforeUpdate = sqlRepository.findAll().size

        // Update the sql
        val updatedSql = sqlRepository.findById(sql.id).get()
        // Disconnect from session so that the updates on updatedSql are not directly saved in db
        em.detach(updatedSql)
        updatedSql.title = UPDATED_TITLE
        updatedSql.description = UPDATED_DESCRIPTION
        updatedSql.activated = UPDATED_ACTIVATED
        updatedSql.orderNo = UPDATED_ORDER_NO
        val sqlDTO = sqlMapper.toDto(updatedSql)

        restSqlMockMvc.perform(
            put(ENTITY_API_URL_ID, sqlDTO.id).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(convertObjectToJsonBytes(sqlDTO))
        ).andExpect(status().isOk)

        // Validate the Sql in the database
        val sqlList = sqlRepository.findAll()
        assertThat(sqlList).hasSize(databaseSizeBeforeUpdate)
        val testSql = sqlList[sqlList.size - 1]
        assertThat(testSql.title).isEqualTo(UPDATED_TITLE)
        assertThat(testSql.description).isEqualTo(UPDATED_DESCRIPTION)
        assertThat(testSql.activated).isEqualTo(UPDATED_ACTIVATED)
        assertThat(testSql.orderNo).isEqualTo(UPDATED_ORDER_NO)
    }

    @Test
    @Transactional
    fun putNonExistingSql() {
        val databaseSizeBeforeUpdate = sqlRepository.findAll().size
        sql.id = count.incrementAndGet()

        // Create the Sql
        val sqlDTO = sqlMapper.toDto(sql)

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSqlMockMvc.perform(
            put(ENTITY_API_URL_ID, sqlDTO.id).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(convertObjectToJsonBytes(sqlDTO))
        )
            .andExpect(status().isBadRequest)

        // Validate the Sql in the database
        val sqlList = sqlRepository.findAll()
        assertThat(sqlList).hasSize(databaseSizeBeforeUpdate)
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun putWithIdMismatchSql() {
        val databaseSizeBeforeUpdate = sqlRepository.findAll().size
        sql.id = count.incrementAndGet()

        // Create the Sql
        val sqlDTO = sqlMapper.toDto(sql)

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSqlMockMvc.perform(
            put(ENTITY_API_URL_ID, count.incrementAndGet()).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(convertObjectToJsonBytes(sqlDTO))
        ).andExpect(status().isBadRequest)

        // Validate the Sql in the database
        val sqlList = sqlRepository.findAll()
        assertThat(sqlList).hasSize(databaseSizeBeforeUpdate)
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun putWithMissingIdPathParamSql() {
        val databaseSizeBeforeUpdate = sqlRepository.findAll().size
        sql.id = count.incrementAndGet()

        // Create the Sql
        val sqlDTO = sqlMapper.toDto(sql)

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSqlMockMvc.perform(
            put(ENTITY_API_URL).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(convertObjectToJsonBytes(sqlDTO))
        )
            .andExpect(status().isMethodNotAllowed)

        // Validate the Sql in the database
        val sqlList = sqlRepository.findAll()
        assertThat(sqlList).hasSize(databaseSizeBeforeUpdate)
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun partialUpdateSqlWithPatch() {
        sqlRepository.saveAndFlush(sql)

        val databaseSizeBeforeUpdate = sqlRepository.findAll().size

// Update the sql using partial update
        val partialUpdatedSql = Sql().apply {
            id = sql.id

            title = UPDATED_TITLE
            description = UPDATED_DESCRIPTION
        }

        restSqlMockMvc.perform(
            patch(ENTITY_API_URL_ID, partialUpdatedSql.id).with(csrf())
                .contentType("application/merge-patch+json")
                .content(convertObjectToJsonBytes(partialUpdatedSql))
        )
            .andExpect(status().isOk)

// Validate the Sql in the database
        val sqlList = sqlRepository.findAll()
        assertThat(sqlList).hasSize(databaseSizeBeforeUpdate)
        val testSql = sqlList.last()
        assertThat(testSql.title).isEqualTo(UPDATED_TITLE)
        assertThat(testSql.description).isEqualTo(UPDATED_DESCRIPTION)
        assertThat(testSql.activated).isEqualTo(DEFAULT_ACTIVATED)
        assertThat(testSql.orderNo).isEqualTo(DEFAULT_ORDER_NO)
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun fullUpdateSqlWithPatch() {
        sqlRepository.saveAndFlush(sql)

        val databaseSizeBeforeUpdate = sqlRepository.findAll().size

// Update the sql using partial update
        val partialUpdatedSql = Sql().apply {
            id = sql.id

            title = UPDATED_TITLE
            description = UPDATED_DESCRIPTION
            activated = UPDATED_ACTIVATED
            orderNo = UPDATED_ORDER_NO
        }

        restSqlMockMvc.perform(
            patch(ENTITY_API_URL_ID, partialUpdatedSql.id).with(csrf())
                .contentType("application/merge-patch+json")
                .content(convertObjectToJsonBytes(partialUpdatedSql))
        )
            .andExpect(status().isOk)

// Validate the Sql in the database
        val sqlList = sqlRepository.findAll()
        assertThat(sqlList).hasSize(databaseSizeBeforeUpdate)
        val testSql = sqlList.last()
        assertThat(testSql.title).isEqualTo(UPDATED_TITLE)
        assertThat(testSql.description).isEqualTo(UPDATED_DESCRIPTION)
        assertThat(testSql.activated).isEqualTo(UPDATED_ACTIVATED)
        assertThat(testSql.orderNo).isEqualTo(UPDATED_ORDER_NO)
    }

    @Throws(Exception::class)
    fun patchNonExistingSql() {
        val databaseSizeBeforeUpdate = sqlRepository.findAll().size
        sql.id = count.incrementAndGet()

        // Create the Sql
        val sqlDTO = sqlMapper.toDto(sql)

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSqlMockMvc.perform(
            patch(ENTITY_API_URL_ID, sqlDTO.id).with(csrf())
                .contentType("application/merge-patch+json")
                .content(convertObjectToJsonBytes(sqlDTO))
        )
            .andExpect(status().isBadRequest)

        // Validate the Sql in the database
        val sqlList = sqlRepository.findAll()
        assertThat(sqlList).hasSize(databaseSizeBeforeUpdate)
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun patchWithIdMismatchSql() {
        val databaseSizeBeforeUpdate = sqlRepository.findAll().size
        sql.id = count.incrementAndGet()

        // Create the Sql
        val sqlDTO = sqlMapper.toDto(sql)

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSqlMockMvc.perform(
            patch(ENTITY_API_URL_ID, count.incrementAndGet()).with(csrf())
                .contentType("application/merge-patch+json")
                .content(convertObjectToJsonBytes(sqlDTO))
        )
            .andExpect(status().isBadRequest)

        // Validate the Sql in the database
        val sqlList = sqlRepository.findAll()
        assertThat(sqlList).hasSize(databaseSizeBeforeUpdate)
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun patchWithMissingIdPathParamSql() {
        val databaseSizeBeforeUpdate = sqlRepository.findAll().size
        sql.id = count.incrementAndGet()

        // Create the Sql
        val sqlDTO = sqlMapper.toDto(sql)

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSqlMockMvc.perform(
            patch(ENTITY_API_URL).with(csrf())
                .contentType("application/merge-patch+json")
                .content(convertObjectToJsonBytes(sqlDTO))
        )
            .andExpect(status().isMethodNotAllowed)

        // Validate the Sql in the database
        val sqlList = sqlRepository.findAll()
        assertThat(sqlList).hasSize(databaseSizeBeforeUpdate)
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun deleteSql() {
        // Initialize the database
        sqlRepository.saveAndFlush(sql)
        val databaseSizeBeforeDelete = sqlRepository.findAll().size
        // Delete the sql
        restSqlMockMvc.perform(
            delete(ENTITY_API_URL_ID, sql.id).with(csrf())
                .accept(MediaType.APPLICATION_JSON)
        ).andExpect(status().isNoContent)

        // Validate the database contains one less item
        val sqlList = sqlRepository.findAll()
        assertThat(sqlList).hasSize(databaseSizeBeforeDelete - 1)
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

        private val ENTITY_API_URL: String = "/api/sqls"
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
        fun createEntity(em: EntityManager): Sql {
            val sql = Sql(
                title = DEFAULT_TITLE,

                description = DEFAULT_DESCRIPTION,

                activated = DEFAULT_ACTIVATED,

                orderNo = DEFAULT_ORDER_NO

            )

            return sql
        }

        /**
         * Create an updated entity for this test.
         *
         * This is a static method, as tests for other entities might also need it,
         * if they test an entity which requires the current entity.
         */
        @JvmStatic
        fun createUpdatedEntity(em: EntityManager): Sql {
            val sql = Sql(
                title = UPDATED_TITLE,

                description = UPDATED_DESCRIPTION,

                activated = UPDATED_ACTIVATED,

                orderNo = UPDATED_ORDER_NO

            )

            return sql
        }
    }
}
