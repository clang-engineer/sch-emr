package com.planitsquare.schemr.web.rest

import com.fasterxml.jackson.databind.ObjectMapper
import com.planitsquare.schemr.IntegrationTest
import com.planitsquare.schemr.web.rest.vm.OdsSearchVM
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OdsSearchControllerIT {
    @Autowired
    private lateinit var restMockMvc: MockMvc

    private lateinit var objectMapper: ObjectMapper

    @BeforeEach
    fun setup() {
        this.objectMapper = ObjectMapper()
    }

    @Test
    @Throws(Exception::class)
    fun testSearchOds() {
        val odsSearchVM =
            OdsSearchVM(
                key = "testKey",
                map = mapOf("param1" to "value1", "param2" to "value2"),
            )

        restMockMvc
            .perform(
                post("/api/ods")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(odsSearchVM))
                    .with(csrf()),
            ).andExpect(status().isOk)
    }
}
