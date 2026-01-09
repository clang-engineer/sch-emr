package com.planitsquare.schemr.service.dto

import com.planitsquare.schemr.web.rest.equalsVerifier
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class SqlDTOTest {

    @Test
    fun dtoEqualsVerifier() {
        equalsVerifier(SqlDTO::class)
        val sqlDTO1 = SqlDTO()
        sqlDTO1.id = 1L
        val sqlDTO2 = SqlDTO()
        assertThat(sqlDTO1).isNotEqualTo(sqlDTO2)
        sqlDTO2.id = sqlDTO1.id
        assertThat(sqlDTO1).isEqualTo(sqlDTO2)
        sqlDTO2.id = 2L
        assertThat(sqlDTO1).isNotEqualTo(sqlDTO2)
        sqlDTO1.id = null
        assertThat(sqlDTO1).isNotEqualTo(sqlDTO2)
    }
}
