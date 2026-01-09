package com.planitsquare.schemr.service.mapper

import org.junit.jupiter.api.BeforeEach

class SqlMapperTest {

    private lateinit var sqlMapper: SqlMapper

    @BeforeEach
    fun setUp() {
        sqlMapper = SqlMapperImpl()
    }
}
