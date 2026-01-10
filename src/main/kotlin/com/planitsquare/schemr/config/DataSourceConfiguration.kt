package com.planitsquare.schemr.config

import com.zaxxer.hikari.HikariDataSource
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import javax.sql.DataSource

@Configuration
class DataSourceConfiguration {

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource.meta")
    fun metaDataSourceProperties(): DataSourceProperties = DataSourceProperties()

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource.meta.hikari")
    fun metaDataSource(
        @Qualifier("metaDataSourceProperties") properties: DataSourceProperties
    ): DataSource = properties.initializeDataSourceBuilder().type(HikariDataSource::class.java).build()

    @Bean
    @ConfigurationProperties("spring.datasource.ods")
    fun odsDataSourceProperties(): DataSourceProperties = DataSourceProperties()

    @Bean
    @ConfigurationProperties("spring.datasource.ods.hikari")
    fun odsDataSource(
        @Qualifier("odsDataSourceProperties") properties: DataSourceProperties
    ): DataSource = properties.initializeDataSourceBuilder().type(HikariDataSource::class.java).build()

    @Bean
    fun odsNamedParameterJdbcTemplate(
        @Qualifier("odsDataSource") dataSource: DataSource
    ): NamedParameterJdbcTemplate =
        NamedParameterJdbcTemplate(dataSource)
}
