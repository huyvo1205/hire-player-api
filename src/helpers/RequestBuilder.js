import Path from "path"
import * as CreateError from "http-errors"
import packageURL from "url"
import { ERROR_CODES } from "../constants/GlobalConstant"

class RequestBuilder {
    constructor() {
        this.method = ""
        this.path = ""
        this.timeout = 1000
        this.json = true
        this.resolveWithFullResponse = true
        this.simple = false
        this.headers = {}
        this.qs = {}
        this.data = {}
        this.form = {}
        this.formData = {}
        return this
    }

    withBody(body) {
        this.data = Object.assign(this.data, body)
        return this
    }

    makePOST(body = null) {
        this.method = "POST"
        if (body) return this.withBody(body)
        return this
    }

    makePUT(body = null) {
        this.method = "PUT"
        if (body) return this.withBody(body)
        return this
    }

    makePATCH(body = null) {
        this.method = "PATCH"
        if (body) {
            return this.withBody(body)
        }
        return this
    }

    makeDELETE(body = null) {
        this.method = "DELETE"
        if (body) return this.withBody(body)
        return this
    }

    makeGET(qs = null) {
        this.method = "GET"
        if (qs) return this.withQueryString(qs)
        return this
    }

    withQueryString(qs) {
        this.qs = Object.assign(this.qs, qs)
        return this
    }

    willTimeoutIn(timeout) {
        this.timeout = timeout
        return this
    }

    withHeaders(headers) {
        this.headers = Object.assign(this.headers, headers)
        return this
    }

    withPath(path) {
        let newPath = Path.join(this.path, path)
        newPath = Path.normalize(newPath)
        this.path = newPath
        return this
    }

    build(host) {
        if (!host) {
            throw new CreateError.InternalServerError(ERROR_CODES.ERROR_HOST_INVALID)
        }
        if (!this.method) {
            throw new CreateError.InternalServerError(ERROR_CODES.ERROR_METHOD_INVALID)
        }
        const url = new packageURL.URL(host)
        const options = {
            url: url.href.toString(),
            method: this.method
        }

        if (this.headers) {
            options.headers = this.headers
        }

        if (Object.keys(this.data).length !== 0) {
            options.data = this.data
        }

        if (Object.keys(this.qs).length !== 0) {
            options.qs = this.qs
        }

        if (Object.keys(this.form).length !== 0) {
            options.json = false
            options.form = this.form
        }

        if (Object.keys(this.formData).length !== 0) {
            options.json = false
            options.formData = this.formData
        }

        if (this.timeout) {
            options.timeout = this.timeout
        }
        return options
    }
}

export default new RequestBuilder()
// const options = this.reqBuilder()
// .trusted(APP_CONFIG.ACCESS_TRUSTED_KF_AUDIT_LOGS)
// .withPath('/v1/auditlogs/migration')
// .makePOST({ object_id: transferItem._id, controller: this.ctrlName, reference: transferItem.code })
// .build();
