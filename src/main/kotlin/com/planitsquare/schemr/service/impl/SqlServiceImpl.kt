package com.planitsquare.schemr.service.impl

import com.planitsquare.schemr.domain.Sql
import com.planitsquare.schemr.repository.SqlRepository
import com.planitsquare.schemr.service.SqlService
import com.planitsquare.schemr.service.dto.SqlDTO
import com.planitsquare.schemr.service.mapper.SqlMapper
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.Optional

/**
 * Service Implementation for managing [Sql].
 */
@Service
@Transactional
class SqlServiceImpl(
    private val sqlRepository: SqlRepository,
    private val sqlMapper: SqlMapper,
) : SqlService {

    private val log = LoggerFactory.getLogger(javaClass)

    override fun save(sqlDTO: SqlDTO): SqlDTO {
        log.debug("Request to save Sql : $sqlDTO")
        var sql = sqlMapper.toEntity(sqlDTO)
        sql = sqlRepository.save(sql)
        return sqlMapper.toDto(sql)
    }

    override fun update(sqlDTO: SqlDTO): SqlDTO {
        log.debug("Request to update Sql : {}", sqlDTO)
        var sql = sqlMapper.toEntity(sqlDTO)
        sql = sqlRepository.save(sql)
        return sqlMapper.toDto(sql)
    }

    override fun partialUpdate(sqlDTO: SqlDTO): Optional<SqlDTO> {
        log.debug("Request to partially update Sql : {}", sqlDTO)

        return sqlRepository.findById(sqlDTO.id)
            .map {
                sqlMapper.partialUpdate(it, sqlDTO)
                it
            }
            .map { sqlRepository.save(it) }
            .map { sqlMapper.toDto(it) }
    }

    @Transactional(readOnly = true)
    override fun findAll(pageable: Pageable): Page<SqlDTO> {
        log.debug("Request to get all Sqls")
        return sqlRepository.findAll(pageable)
            .map(sqlMapper::toDto)
    }

    @Transactional(readOnly = true)
    override fun findOne(id: Long): Optional<SqlDTO> {
        log.debug("Request to get Sql : $id")
        return sqlRepository.findById(id)
            .map(sqlMapper::toDto)
    }

    override fun delete(id: Long) {
        log.debug("Request to delete Sql : $id")

        sqlRepository.deleteById(id)
    }
}
