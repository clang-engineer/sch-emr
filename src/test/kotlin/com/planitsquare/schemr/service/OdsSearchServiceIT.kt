package com.planitsquare.schemr.service

import com.planitsquare.schemr.IntegrationTest
import com.planitsquare.schemr.domain.Sql
import com.planitsquare.schemr.domain.SqlParam
import com.planitsquare.schemr.domain.enumeration.SqlParamType
import com.planitsquare.schemr.repository.SqlRepository
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate

/**
 * Integration tests for [OdsSearchService].
 */
@IntegrationTest
@Transactional
class OdsSearchServiceIT {
    @Autowired
    private lateinit var odsSearchService: OdsSearchService

    @Autowired
    private lateinit var sqlRepository: SqlRepository

    @Autowired
    @Qualifier("odsNamedParameterJdbcTemplate")
    private lateinit var jdbcTemplate: NamedParameterJdbcTemplate

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
    fun executeQuery_withValidParameters_shouldReturnResults() {
        val sql =
            createSqlEntity(
                title = "TEST_SELECT",
                description = "SELECT * FROM test_users WHERE age > :minAge AND status = :status",
                activated = "Y",
                params =
                setOf(
                    SqlParam(name = "minAge", type = SqlParamType.INTEGER),
                    SqlParam(name = "status", type = SqlParamType.STRING),
                ),
            )
        sqlRepository.saveAndFlush(sql)

        val params =
            mapOf(
                "minAge" to 25,
                "status" to "ACTIVE",
            )

        val results = odsSearchService.executeQuery("TEST_SELECT", params)

        assertThat(results).isNotEmpty
        assertThat(results).hasSize(2)
        assertThat(results[0]["name"]).isEqualTo("Alice")
        assertThat(results[1]["name"]).isEqualTo("Bob")
    }

    @Test
    fun executeQuery_withDateParameters_shouldReturnResults() {
        val sql =
            createSqlEntity(
                title = "TEST_SELECT_DATE",
                description = "SELECT * FROM test_users WHERE created_date >= :startDate",
                activated = "Y",
                params =
                setOf(
                    SqlParam(name = "startDate", type = SqlParamType.DATE),
                ),
            )
        sqlRepository.saveAndFlush(sql)

        val params =
            mapOf(
                "startDate" to LocalDate.of(2024, 1, 1),
            )

        val results = odsSearchService.executeQuery("TEST_SELECT_DATE", params)

        assertThat(results).isNotEmpty
        assertThat(results).hasSize(3)
    }

    @Test
    fun executeQuery_whenSqlNotFound_shouldThrowException() {
        assertThatThrownBy {
            odsSearchService.executeQuery("NONEXISTENT_SQL", emptyMap())
        }.isInstanceOf(IllegalArgumentException::class.java)
            .hasMessageContaining("SQL entity with title 'NONEXISTENT_SQL' not found")
    }

    @Test
    fun executeQuery_whenSqlNotActivated_shouldThrowException() {
        val sql =
            createSqlEntity(
                title = "INACTIVE_SQL",
                description = "SELECT * FROM test_users",
                activated = "N",
                params = emptySet(),
            )
        sqlRepository.saveAndFlush(sql)

        assertThatThrownBy {
            odsSearchService.executeQuery("INACTIVE_SQL", emptyMap())
        }.isInstanceOf(IllegalStateException::class.java)
            .hasMessageContaining("is not activated")
    }

    @Test
    fun executeQuery_whenParameterMissing_shouldThrowException() {
        val sql =
            createSqlEntity(
                title = "MISSING_PARAM",
                description = "SELECT * FROM test_users WHERE age > :minAge",
                activated = "Y",
                params =
                setOf(
                    SqlParam(name = "minAge", type = SqlParamType.INTEGER),
                ),
            )
        sqlRepository.saveAndFlush(sql)

        assertThatThrownBy {
            odsSearchService.executeQuery("MISSING_PARAM", emptyMap())
        }.isInstanceOf(IllegalArgumentException::class.java)
            .hasMessageContaining("Missing parameter: minAge")
    }

    @Test
    fun executeQuery_withMultipleParametersInDifferentOrder_shouldWorkCorrectly() {
        val sql =
            createSqlEntity(
                title = "MULTI_PARAM",
                description = "SELECT * FROM test_users WHERE age > :minAge AND age < :maxAge AND status = :status",
                activated = "Y",
                params =
                setOf(
                    SqlParam(name = "maxAge", type = SqlParamType.INTEGER),
                    SqlParam(name = "minAge", type = SqlParamType.INTEGER),
                    SqlParam(name = "status", type = SqlParamType.STRING),
                ),
            )
        sqlRepository.saveAndFlush(sql)

        val params =
            mapOf(
                "minAge" to 20,
                "maxAge" to 40,
                "status" to "ACTIVE",
            )

        val results = odsSearchService.executeQuery("MULTI_PARAM", params)

        assertThat(results).isNotEmpty
        results.forEach { row ->
            val age = (row["age"] as Number).toInt()
            assertThat(age).isGreaterThan(20).isLessThan(40)
            assertThat(row["status"]).isEqualTo("ACTIVE")
        }
    }

    @Test
    fun executeQuery_withMultilineQuery_shouldWorkCorrectly() {
        val sql =
            createSqlEntity(
                title = "MULTILINE_QUERY",
                description =
                """
                SELECT *
                FROM test_users
                WHERE age > :minAge
                  AND status = :status
                ORDER BY age DESC
                """.trimIndent(),
                activated = "Y",
                params =
                setOf(
                    SqlParam(name = "minAge", type = SqlParamType.INTEGER),
                    SqlParam(name = "status", type = SqlParamType.STRING),
                ),
            )
        sqlRepository.saveAndFlush(sql)

        val params =
            mapOf(
                "minAge" to 25,
                "status" to "ACTIVE",
            )

        val results = odsSearchService.executeQuery("MULTILINE_QUERY", params)

        assertThat(results).isNotEmpty
        assertThat(results).hasSize(2)
        assertThat(results[0]["name"]).isEqualTo("Alice")
        assertThat(results[0]["age"]).isEqualTo(30)
        assertThat(results[1]["name"]).isEqualTo("Bob")
        assertThat(results[1]["age"]).isEqualTo(28)
    }

    @Test
    fun executeQuery_withCaseInsensitiveParametersInMultilineQuery_shouldWorkCorrectly() {
        val sql =
            createSqlEntity(
                title = "CASE_INSENSITIVE_MULTILINE",
                description =
                """
                SELECT
                    name,
                    age,
                    status
                FROM test_users
                WHERE age > :minAge
                  AND age < :maxAge
                  AND status = :userStatus
                """.trimIndent(),
                activated = "Y",
                params =
                setOf(
                    SqlParam(name = "minAge", type = SqlParamType.INTEGER),
                    SqlParam(name = "maxAge", type = SqlParamType.INTEGER),
                    SqlParam(name = "userStatus", type = SqlParamType.STRING),
                ),
            )
        sqlRepository.saveAndFlush(sql)

        // Provide parameters with different case
        val params =
            mapOf(
                "MINAGE" to 20,
                "maxage" to 35,
                "UserStatus" to "ACTIVE",
            )

        val results = odsSearchService.executeQuery("CASE_INSENSITIVE_MULTILINE", params)

        assertThat(results).isNotEmpty
        assertThat(results).hasSize(2)
        results.forEach { row ->
            val age = (row["age"] as Number).toInt()
            assertThat(age).isGreaterThan(20).isLessThan(35)
            assertThat(row["status"]).isEqualTo("ACTIVE")
        }
    }

    private fun createSqlEntity(
        title: String,
        description: String,
        activated: String,
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
