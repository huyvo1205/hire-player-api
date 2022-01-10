import DonateModel from "../models/DonateModel"
import DonateConstant from "../constants/DonateConstant"

class DonateService {
    async createDonate(data) {
        const newDonate = await DonateModel.create(data)
        return newDonate
    }

    async getDetailDonate(id) {
        return DonateModel.findOne({ _id: id })
            .populate(DonateConstant.POPULATE_FROM_USER)
            .populate(DonateConstant.POPULATE_TO_USER)
    }

    async getListDonates(filter, options) {
        const donates = await DonateModel.paginate(filter, options)
        return donates
    }
}

export default new DonateService()
