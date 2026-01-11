
package com.planitsquare.schemr.web.rest.vm

import javax.validation.constraints.NotBlank

class OdsSearchVM(
    @field:NotBlank
    var key: String?,
    var map: Map<String, Any>?,
)
