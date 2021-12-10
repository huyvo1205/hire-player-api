import Ajv from "ajv"

import * as CreateError from "http-errors"
import * as _ from "lodash"
import AjvBson from "ajv-bsontype"
import AjvErrors from "ajv-errors"

const ajv = new Ajv({
    allErrors: true,
    useDefaults: true,
    removeAdditional: true,
    async: true,
    passContext: true,
    coerceTypes: true
})

AjvBson(ajv)
AjvErrors(ajv)

function formatErrors(errors) {
    const newErrors = errors.map(error => {
        const { keyword, params } = error
        const { missingProperty } = params

        if (keyword === "required") {
            const message = `${missingProperty} is required`
            return message
        }

        if (keyword === "pattern") {
            const field = error.instancePath.split("/")[1]
            const message = `${field} invalid`
            return message
        }
        console.log("error", error)
        if (error.dataPath) {
            const paths = error.dataPath.split("/")
            if (paths.length > 0) {
                const field = paths.splice(-1)
                return `${field} invalid`
            }
        }

        if (error.instancePath) {
            const paths = error.instancePath.split("/")
            if (paths.length > 0) {
                const field = paths.splice(-1)
                return `${field} ${error.message}`
            }
        }

        return "error"
    })
    return [...newErrors]
}

function validateSchema(schema, path = "body") {
    if (!schema) throw CreateError.InternalServerError("Schema is required.")
    const newSchema = _.cloneDeep(schema)
    newSchema.$async = true

    return async (req, res, next) => {
        try {
            await ajv.validate(newSchema, req[path])
            next()
        } catch (err) {
            if (!(err instanceof Ajv.ValidationError)) {
                throw CreateError.InternalServerError(err.message)
            }
            const errors = formatErrors(err.errors)
            throw new CreateError.BadRequest(errors)
        }
    }
}

function validateBody(schema) {
    return validateSchema(schema, "body")
}

function validateQuery(schema) {
    return validateSchema(schema, "query")
}

function validateParams(schema) {
    return validateSchema(schema, "params")
}

const AuthValidator = require("./AuthValidator")

export { AuthValidator, validateBody, validateQuery, validateParams }
