import HireModel from "../models/HireModel"
import HireConstant from "../constants/HireConstant"

class HireService {
    async createHire(data, isPopulate = true) {
        const newHire = await HireModel.create(data)
        if (isPopulate) {
            return HireModel.findById(newHire.id)
                .populate(HireConstant.POPULATE_CUSTOMER)
                .populate(HireConstant.POPULATE_PLAYER)
        }
        return newHire
    }

    async updateHire(id, updateData, isPopulate = true) {
        const newHire = await HireModel.updateOne({ _id: id }, updateData)
        if (isPopulate) {
            const hire = await HireModel.findById(id)
                .populate(HireConstant.POPULATE_CUSTOMER)
                .populate(HireConstant.POPULATE_PLAYER)
            return hire
        }
        return newHire
    }

    async getDetailHire(id) {
        return HireModel.findOne({ _id: id })
            .populate(HireConstant.POPULATE_CUSTOMER)
            .populate(HireConstant.POPULATE_PLAYER)
    }

    async deleteHire(id) {
        return HireModel.deleteOne({ _id: id })
    }

    async getListHires(filter, options) {
        const Hires = await HireModel.paginate(filter, options)
        return Hires
    }
}

export default new HireService()
