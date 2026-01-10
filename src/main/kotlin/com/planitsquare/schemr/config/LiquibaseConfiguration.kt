package com.planitsquare.schemr.config

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties
import org.springframework.boot.autoconfigure.liquibase.LiquibaseProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.env.Environment
import org.springframework.core.env.Profiles
import tech.jhipster.config.JHipsterConstants
import tech.jhipster.config.liquibase.SpringLiquibaseUtil
import java.util.concurrent.Executor
import javax.sql.DataSource

@Configuration
class LiquibaseConfiguration(private val env: Environment) {

    private val log = LoggerFactory.getLogger(javaClass)

    @Bean
    fun liquibase(
        @Qualifier("taskExecutor") executor: Executor,
        liquibaseProperties: LiquibaseProperties,
        @Qualifier("metaDataSource") dataSource: DataSource,
        @Qualifier("metaDataSourceProperties") dataSourceProperties: DataSourceProperties
    ) =
        // If you don't want Liquibase to start asynchronously, substitute by this:
        // val liquibase = SpringLiquibaseUtil.createSpringLiquibase(dataSource, liquibaseProperties, dataSource, dataSourceProperties)
        SpringLiquibaseUtil.createAsyncSpringLiquibase(this.env, executor, dataSource, liquibaseProperties, dataSource, dataSourceProperties)
            .apply {
                changeLog = "classpath:config/liquibase/master.xml"
                contexts = liquibaseProperties.contexts
                defaultSchema = liquibaseProperties.defaultSchema
                liquibaseSchema = liquibaseProperties.liquibaseSchema
                liquibaseTablespace = liquibaseProperties.liquibaseTablespace
                databaseChangeLogLockTable = liquibaseProperties.databaseChangeLogLockTable
                databaseChangeLogTable = liquibaseProperties.databaseChangeLogTable
                isDropFirst = liquibaseProperties.isDropFirst
                labels = liquibaseProperties.labels
                setChangeLogParameters(liquibaseProperties.parameters)
                setRollbackFile(liquibaseProperties.rollbackFile)
                isTestRollbackOnUpdate = liquibaseProperties.isTestRollbackOnUpdate

                if (env.acceptsProfiles(Profiles.of(JHipsterConstants.SPRING_PROFILE_NO_LIQUIBASE))) {
                    setShouldRun(false)
                } else {
                    setShouldRun(liquibaseProperties.isEnabled)
                    log.debug("Configuring Liquibase")
                }
            }
}
