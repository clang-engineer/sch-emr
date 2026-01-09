package com.planitsquare.schemr.domain

import com.planitsquare.schemr.web.rest.equalsVerifier
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class SqlTest {

    @Test
    fun equalsVerifier() {
        equalsVerifier(Sql::class)
        val sql1 = Sql()
        sql1.id = 1L
        val sql2 = Sql()
        sql2.id = sql1.id
        assertThat(sql1).isEqualTo(sql2)
        sql2.id = 2L
        assertThat(sql1).isNotEqualTo(sql2)
        sql1.id = null
        assertThat(sql1).isNotEqualTo(sql2)
    }
}
