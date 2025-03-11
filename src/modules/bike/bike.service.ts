import QueryBuilder from "../../builder/QueryBuilder";
import { BikeSearchableFields} from "./bike.constant";
import { TBike } from "./bike.interface";
import {Bike} from "./bike.model";

// Create bike
const createBikeIntoDB = async (payload: TBike) => {
    const result = await Bike.create(payload);
    return result;
};

const getAllBikesFromDB =  async (query: Record<string, unknown>) => {
    const bikeQuery = new QueryBuilder(Bike.find(),query)
    .search(BikeSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

    const product = await bikeQuery.modelQuery;
    const result = await bikeQuery.countTotal();

    return {
        product, result,
    };
};


const getSingleBikeFromDB = async (id:string) => {
    const result = await Bike.findById(id);
    return result;
}


const updateBikeIntoDB = async (
    id: string,
    payload: Partial<TBike>,
) => {

    const existingBike = await Bike.findById(id);
    if (!existingBike) {
        throw new Error("Bike not found");
    }

    const result = await Bike.findOneAndUpdate(
        { 
           _id: id, 
          isDeleted: false
        },
        payload,
        {
            new: true,
        },
    );
    return result;
};


const deleteBikeFromDB = async (id: string) => {
    const result = await Bike.findByIdAndUpdate(
        id,
        { isDeleted: true },
        {
            new: true,
        },
    );
    return result;
};

export const bikeService = {
    createBikeIntoDB,
    getAllBikesFromDB,
    getSingleBikeFromDB,
    updateBikeIntoDB,
    deleteBikeFromDB
  };