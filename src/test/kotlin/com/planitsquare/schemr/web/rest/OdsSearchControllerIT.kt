package com.planitsquare.schemr.web.rest

import com.planitsquare.schemr.IntegrationTest
import com.planitsquare.schemr.domain.Sql
import com.planitsquare.schemr.domain.SqlParam
import com.planitsquare.schemr.domain.enumeration.SqlParamType
import com.planitsquare.schemr.repository.SqlRepository
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate

/**
 * Integration tests for [OdsSearchController].
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
@Transactional
class OdsSearchControllerIT {

    @Autowired
    private lateinit var sqlRepository: SqlRepository

    @Autowired
    @Qualifier("odsNamedParameterJdbcTemplate")
    private lateinit var jdbcTemplate: NamedParameterJdbcTemplate

    @Autowired
    private lateinit var restMockMvc: MockMvc

    companion object {
        private const val SELECT_COLUMNS = """id AS "id", name AS "name", age AS "age", status AS "status", created_date AS "created_date""""

        private fun buildQuery(whereClause: String = "", orderByClause: String = ""): String {
            val query = StringBuilder("SELECT $SELECT_COLUMNS FROM test_users")
            if (whereClause.isNotEmpty()) {
                query.append(" WHERE ").append(whereClause)
            }
            if (orderByClause.isNotEmpty()) {
                query.append(" ORDER BY ").append(orderByClause)
            }
            return query.toString()
        }
    }

    @BeforeEach
    fun setUp() {
        createTestTable()
        insertTestData()
    }

    @AfterEach
    fun tearDown() {
        dropTestTable()
    }

    @Test
    fun search_withValidParameters_shouldReturnResults() {
        val sql =
            createSqlEntity(
                title = "TEST_SELECT",
                description = buildQuery(whereClause = "age > :minAge AND status = :status"),
                activated = true,
                params =
                setOf(
                    SqlParam(name = "minAge", type = SqlParamType.INTEGER),
                    SqlParam(name = "status", type = SqlParamType.STRING),
                ),
            )
        sqlRepository.saveAndFlush(sql)

        restMockMvc
            .perform(
                post("/api/ods")
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {
                            "key": "TEST_SELECT",
                            "map": {
                                "minAge": 25,
                                "status": "ACTIVE"
                            }
                        }
                        """.trimIndent(),
                    ),
            )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.length()").value(2))
            .andExpect(jsonPath("$[0].name").value("Alice"))
            .andExpect(jsonPath("$[1].name").value("Bob"))
    }

    @Test
    fun search_withDateParameters_shouldReturnResults() {
        val sql =
            createSqlEntity(
                title = "TEST_SELECT_DATE",
                description = buildQuery(whereClause = "created_date >= :startDate"),
                activated = true,
                params =
                setOf(
                    SqlParam(name = "startDate", type = SqlParamType.DATE),
                ),
            )
        sqlRepository.saveAndFlush(sql)

        restMockMvc
            .perform(
                post("/api/ods")
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {
                            "key": "TEST_SELECT_DATE",
                            "map": {
                                "startDate": "2024-01-01"
                            }
                        }
                        """.trimIndent(),
                    ),
            )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.length()").value(3))
    }

    @Test
    fun search_whenSqlNotFound_shouldReturnError() {
        restMockMvc
            .perform(
                post("/api/ods")
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {
                            "key": "NONEXISTENT_SQL",
                            "map": {}
                        }
                        """.trimIndent(),
                    ),
            )
            .andExpect(status().is4xxClientError)
    }

    @Test
    fun search_whenSqlNotActivated_shouldReturnError() {
        val sql =
            createSqlEntity(
                title = "INACTIVE_SQL",
                description = buildQuery(),
                activated = false,
                params = emptySet(),
            )
        sqlRepository.saveAndFlush(sql)

        restMockMvc
            .perform(
                post("/api/ods")
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {
                            "key": "INACTIVE_SQL",
                            "map": {}
                        }
                        """.trimIndent(),
                    ),
            )
            .andExpect(status().is4xxClientError)
    }

    @Test
    fun search_whenParameterMissing_shouldReturnError() {
        val sql =
            createSqlEntity(
                title = "MISSING_PARAM",
                description = buildQuery(whereClause = "age > :minAge"),
                activated = true,
                params =
                setOf(
                    SqlParam(name = "minAge", type = SqlParamType.INTEGER),
                ),
            )
        sqlRepository.saveAndFlush(sql)

        restMockMvc
            .perform(
                post("/api/ods")
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {
                            "key": "MISSING_PARAM",
                            "map": {}
                        }
                        """.trimIndent(),
                    ),
            )
            .andExpect(status().is4xxClientError)
    }

    @Test
    fun search_withMultilineQuery_shouldReturnResults() {
        val sql =
            createSqlEntity(
                title = "MULTILINE_QUERY",
                description = buildQuery(
                    whereClause = "age > :minAge AND status = :status",
                    orderByClause = "age DESC"
                ),
                activated = true,
                params =
                setOf(
                    SqlParam(name = "minAge", type = SqlParamType.INTEGER),
                    SqlParam(name = "status", type = SqlParamType.STRING),
                ),
            )
        sqlRepository.saveAndFlush(sql)

        restMockMvc
            .perform(
                post("/api/ods")
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {
                            "key": "MULTILINE_QUERY",
                            "map": {
                                "minAge": 25,
                                "status": "ACTIVE"
                            }
                        }
                        """.trimIndent(),
                    ),
            )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.length()").value(2))
            .andExpect(jsonPath("$[0].name").value("Alice"))
            .andExpect(jsonPath("$[0].age").value(30))
            .andExpect(jsonPath("$[1].name").value("Bob"))
            .andExpect(jsonPath("$[1].age").value(28))
    }

    @Test
    fun search_withCaseInsensitiveParametersInMultilineQuery_shouldReturnResults() {
        val sql =
            createSqlEntity(
                title = "CASE_INSENSITIVE_MULTILINE",
                description = buildQuery(
                    whereClause = "age > :minAge AND age < :maxAge AND status = :userStatus"
                ),
                activated = true,
                params =
                setOf(
                    SqlParam(name = "minAge", type = SqlParamType.INTEGER),
                    SqlParam(name = "maxAge", type = SqlParamType.INTEGER),
                    SqlParam(name = "userStatus", type = SqlParamType.STRING),
                ),
            )
        sqlRepository.saveAndFlush(sql)

        restMockMvc
            .perform(
                post("/api/ods")
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {
                            "key": "CASE_INSENSITIVE_MULTILINE",
                            "map": {
                                "MINAGE": 20,
                                "maxage": 35,
                                "UserStatus": "ACTIVE"
                            }
                        }
                        """.trimIndent(),
                    ),
            )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.length()").value(2))
    }

    @Test
    fun search_withMultipleParametersInDifferentOrder_shouldReturnResults() {
        val sql =
            createSqlEntity(
                title = "MULTI_PARAM",
                description = buildQuery(whereClause = "age > :minAge AND age < :maxAge AND status = :status"),
                activated = true,
                params =
                setOf(
                    SqlParam(name = "maxAge", type = SqlParamType.INTEGER),
                    SqlParam(name = "minAge", type = SqlParamType.INTEGER),
                    SqlParam(name = "status", type = SqlParamType.STRING),
                ),
            )
        sqlRepository.saveAndFlush(sql)

        restMockMvc
            .perform(
                post("/api/ods")
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {
                            "key": "MULTI_PARAM",
                            "map": {
                                "minAge": 20,
                                "maxAge": 40,
                                "status": "ACTIVE"
                            }
                        }
                        """.trimIndent(),
                    ),
            )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.length()").value(2))
    }

    @Test
    fun search_withSameParameterUsedMultipleTimes_shouldReturnResults() {
        val sql =
            createSqlEntity(
                title = "SAME_PARAM_MULTIPLE_TIMES",
                description = buildQuery(whereClause = "name = :searchTerm OR status = :searchTerm"),
                activated = true,
                params =
                setOf(
                    SqlParam(name = "searchTerm", type = SqlParamType.STRING),
                ),
            )
        sqlRepository.saveAndFlush(sql)

        restMockMvc
            .perform(
                post("/api/ods")
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {
                            "key": "SAME_PARAM_MULTIPLE_TIMES",
                            "map": {
                                "searchTerm": "ACTIVE"
                            }
                        }
                        """.trimIndent(),
                    ),
            )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.length()").value(2))
            .andExpect(jsonPath("$[0].name").value("Alice"))
            .andExpect(jsonPath("$[0].status").value("ACTIVE"))
            .andExpect(jsonPath("$[1].name").value("Bob"))
            .andExpect(jsonPath("$[1].status").value("ACTIVE"))
    }

    private fun createSqlEntity(
        title: String,
        description: String,
        activated: Boolean,
        params: Set<SqlParam>,
    ): Sql =
        Sql(
            title = title,
            description = description,
            activated = activated,
            orderNo = 1,
            params = params.toMutableSet(),
        )

    private fun createTestTable() {
        jdbcTemplate.jdbcOperations.execute(
            """
            CREATE TABLE IF NOT EXISTS test_users (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                age INT NOT NULL,
                status VARCHAR(20) NOT NULL,
                created_date DATE NOT NULL
            )
            """.trimIndent(),
        )
    }

    private fun insertTestData() {
        jdbcTemplate.jdbcOperations.update(
            "INSERT INTO test_users (name, age, status, created_date) VALUES (?, ?, ?, ?)",
            "Alice",
            30,
            "ACTIVE",
            java.sql.Date.valueOf(LocalDate.of(2024, 1, 15)),
        )
        jdbcTemplate.jdbcOperations.update(
            "INSERT INTO test_users (name, age, status, created_date) VALUES (?, ?, ?, ?)",
            "Bob",
            28,
            "ACTIVE",
            java.sql.Date.valueOf(LocalDate.of(2024, 2, 20)),
        )
        jdbcTemplate.jdbcOperations.update(
            "INSERT INTO test_users (name, age, status, created_date) VALUES (?, ?, ?, ?)",
            "Charlie",
            22,
            "INACTIVE",
            java.sql.Date.valueOf(LocalDate.of(2024, 3, 10)),
        )
    }

    private fun dropTestTable() {
        jdbcTemplate.jdbcOperations.execute("DROP TABLE IF EXISTS test_users")
    }
}
