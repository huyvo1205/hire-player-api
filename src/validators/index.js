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
    passContext: true
})

AjvBson(ajv)
AjvErrors(ajv)

function formatErrors(errors) {
    const newErrors = errors.map(error => {
        const { keyword, params } = error
        const { missingProperty } = params
        console.log("error", error)

        if (keyword === "required") {
            const message = `error_${missingProperty}_is_required`.toUpperCase()
            return message
        }

        if (keyword === "pattern") {
            const field = error.instancePath.split("/")[1]
            const message = `error_${field}_invalid`.toUpperCase()
            return message
        }

        if (error.dataPath) {
            const paths = error.dataPath.split("/")
            if (paths.length > 0) {
                const field = paths.splice(-1)
                return `error_${field}_invalid`.toUpperCase()
            }
        }

        if (error.instancePath) {
            const paths = error.instancePath.split("/")
            if (paths.length > 0) {
                const field = paths.splice(-1)
                return `error_${field}_${error.message}`.replace(/\s+/g, "_").toUpperCase()
            }
        }

        return "error_input_invalid".toUpperCase()
    })
    return [...newErrors]
}

function validateSchema(schema, path = "body") {
    if (!schema) throw CreateError.InternalServerError("Schema is required.")
    const newSchema = _.cloneDeep(schema)
    newSchema.$async = true
    return async (req, res, next) => {
        try {
            const data = req[path]
            await ajv.validate(newSchema, data)
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
