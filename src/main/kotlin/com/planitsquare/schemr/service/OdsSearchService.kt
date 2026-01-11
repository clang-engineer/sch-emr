package com.planitsquare.schemr.service

import com.planitsquare.schemr.domain.SqlParam
import com.planitsquare.schemr.domain.enumeration.SqlParamType
import com.planitsquare.schemr.repository.SqlRepository
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.sql.Date
import java.sql.Time
import java.sql.Timestamp
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

/**
 * Service for executing SQL queries with dynamic parameters.
 */
@Service
@Transactional(readOnly = true)
class OdsSearchService(
    private val sqlRepository: SqlRepository,
    @Qualifier("odsNamedParameterJdbcTemplate")
    private val jdbcTemplate: NamedParameterJdbcTemplate,
) {
    private val log = LoggerFactory.getLogger(javaClass)

    /**
     * Execute SQL query by title with given parameters.
     * @param title the title of the SQL entity
     * @param params the parameter map (parameter name -> value)
     * @return List of maps containing query results with lowercase keys
     */
    fun executeQuery(
        title: String,
        map: Map<String, Any>,
    ): List<Map<String, Any>> {
        log.debug("Executing SQL query with title: $title and map: $map")

        val sqlEntity =
            sqlRepository.findByTitle(title)
                ?: throw IllegalArgumentException("SQL entity with title '$title' not found")

        if (sqlEntity.activated != true) {
            throw IllegalStateException("SQL entity with title '$title' is not activated")
        }

        val sql = sqlEntity.description ?: ""
        validateReadOnlySql(sql)
        validateParams(sql, sqlEntity.params, map)

        val paramValues = buildParameterValues(sqlEntity.params, map)

        log.debug("Prepared SQL: $sql")
        log.debug("Parameter values: $paramValues")

        val results = jdbcTemplate.queryForList(sql, paramValues)
        return results
    }

    /**
     * Validate that all named parameters used in SQL are defined in the entity and provided in the map.
     */
    private fun validateParams(
        sqlTemplate: String,
        params: Set<SqlParam>,
        map: Map<String, Any>,
    ) {
        val paramNamesInSql = extractNamedParams(sqlTemplate)
        paramNamesInSql.forEach { paramName ->
            // Verify this parameter is defined in the SQL entity (case-insensitive)
            if (params.none { it.name.equals(paramName, ignoreCase = true) }) {
                throw IllegalArgumentException("Parameter :$paramName used in SQL but not defined in entity")
            }
            // Verify this parameter is provided in the map (case-insensitive)
            if (map.keys.none { it.equals(paramName, ignoreCase = true) }) {
                throw IllegalArgumentException("Missing parameter: $paramName")
            }
        }
    }

    /**
     * Extract named parameter names from SQL.
     */
    private fun extractNamedParams(sql: String): Set<String> {
        val regex = Regex(":([a-zA-Z][a-zA-Z0-9_]*)")
        return regex
            .findAll(sql)
            .map { it.groupValues[1] }
            .toSet()
    }

    /**
     * Build parameter map for named binding with type conversion.
     */
    private fun buildParameterValues(
        sqlParams: Set<SqlParam>,
        map: Map<String, Any>,
    ): Map<String, Any?> =
        map
            .mapKeys { (paramName, _) ->
                // Find matching SqlParam (case-insensitive) and use its name
                sqlParams.find { it.name.equals(paramName, ignoreCase = true) }?.name ?: paramName
            }.mapValues { (paramName, paramValue) ->
                val sqlParam =
                    sqlParams.find { it.name.equals(paramName, ignoreCase = true) }
                        ?: throw IllegalArgumentException("Parameter $paramName not found in SQL entity definition")

                convertParameterValue(paramValue, sqlParam.type)
            }

    private fun validateReadOnlySql(sql: String) {
        val trimmed = sql.trimStart()
        if (trimmed.isEmpty()) {
            throw IllegalArgumentException("SQL query is empty")
        }
        val upper = trimmed.uppercase()
        if (!upper.startsWith("SELECT") && !upper.startsWith("WITH")) {
            throw IllegalArgumentException("Only read-only queries are allowed")
        }
    }

    /**
     * Convert parameter value to appropriate JDBC type based on SqlParamType.
     */
    private fun convertParameterValue(
        value: Any,
        type: SqlParamType?,
    ): Any? =
        when (type) {
            SqlParamType.STRING -> {
                value.toString()
            }

            SqlParamType.INTEGER -> {
                when (value) {
                    is Number -> value.toInt()
                    is String -> value.toInt()
                    else -> throw IllegalArgumentException("Cannot convert $value to Integer")
                }
            }

            SqlParamType.LONG -> {
                when (value) {
                    is Number -> value.toLong()
                    is String -> value.toLong()
                    else -> throw IllegalArgumentException("Cannot convert $value to Long")
                }
            }

            SqlParamType.DECIMAL -> {
                when (value) {
                    is BigDecimal -> value
                    is Number -> BigDecimal(value.toString())
                    is String -> BigDecimal(value)
                    else -> throw IllegalArgumentException("Cannot convert $value to BigDecimal")
                }
            }

            SqlParamType.BOOLEAN -> {
                when (value) {
                    is Boolean -> value
                    is String -> value.toBoolean()
                    else -> throw IllegalArgumentException("Cannot convert $value to Boolean")
                }
            }

            SqlParamType.DATE -> {
                when (value) {
                    is LocalDate -> Date.valueOf(value)
                    is String -> Date.valueOf(LocalDate.parse(value))
                    else -> throw IllegalArgumentException("Cannot convert $value to Date")
                }
            }

            SqlParamType.DATETIME -> {
                when (value) {
                    is LocalDateTime -> Timestamp.valueOf(value)
                    is String -> Timestamp.valueOf(LocalDateTime.parse(value))
                    else -> throw IllegalArgumentException("Cannot convert $value to Timestamp")
                }
            }

            SqlParamType.TIME -> {
                when (value) {
                    is LocalTime -> Time.valueOf(value)
                    is String -> Time.valueOf(LocalTime.parse(value))
                    else -> throw IllegalArgumentException("Cannot convert $value to Time")
                }
            }

            null -> {
                throw IllegalArgumentException("Parameter type cannot be null")
            }
        }
}
