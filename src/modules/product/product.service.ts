import QueryBuilder from "../../builder/QueryBuilder";
import { ProductSearchableFields } from "./product.constant";
import { IProduct } from "./product.interface";
import Product from "./product.model";

const createProductFromDB = async (payload:IProduct) => {
const product = Product.create(payload);
return product;
};

const getAllProductsFromDB =  async (query: Record<string, unknown>) => {
    const productQuery = new QueryBuilder(Product.find(),query)
    .search(ProductSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

    const product = await productQuery.modelQuery;
    const result = await productQuery.countTotal();

    return {
        product, result,
    };
};


const getSingleProductsFromDB = async (id:string) => {
    const product = await Product.findById(id);
    return product;
}

//  const updateProductById = async (id: string, payload: Partial<IProduct>) => {
//     if (!payload || Object.keys(payload).length === 0) {
//         throw new Error("No data provided for update");
//     }


//     // const { price,stock,...remainingProductData } = payload;
//     // const modifiedUpdatedData: Record<string, unknown> = {
//     //     ...remainingProductData,
//     //   };

//       // if (name && Object.keys(name).length) {
//       //   for (const [key, value] of Object.entries(name)) {
//       //     modifiedUpdatedData[`name.${key}`] = value;
//       //   }
//       // }
//       // if (price && Object.keys(price).length) {
//       //   for (const [key, value] of Object.entries(price)) {
//       //     modifiedUpdatedData[`price.${key}`] = value;
//       //   }
//       // }
//       // if (stock && Object.keys(stock).length) {
//       //   for (const [key, value] of Object.entries(stock)) {
//       //     modifiedUpdatedData[`stock.${key}`] = value;
//       //   }
//       // }
       
//       const updatedProduct  = await Product.findByIdAndUpdate(
//         { _id: id }, 
//         { $set: payload },
//         { new: true, runValidators: true }
//     );

//       if (!updatedProduct ) {
//         console.log("Product not found or update failed");
//         throw new Error("Product not found or update failed");
//     }
    
//       return updatedProduct ;
//     };

const updateProductById = async (id: string, payload: Partial<IProduct>) => {
  if (!payload || Object.keys(payload).length === 0) {
      throw new Error("No data provided for update");
  }

  console.log("Payload:", payload); // Debugging: Check the payload

  const updatedProduct = await Product.findByIdAndUpdate(
      { _id: id },
      { $set: payload },
      { new: true, runValidators: true }
  );

  if (!updatedProduct) {
      console.log("Product not found or update failed");
      throw new Error("Product not found or update failed");
  }

  console.log("Updated Product in DB:", updatedProduct); // Debugging: Check the updated product

  return updatedProduct;
};

const deleteProductById = async (id: string) => {
  const product = await Product.findById(id); 
  if (!product) {
      throw new Error("Product not found"); 
  }
  await Product.findByIdAndDelete(id); 
  return product; 
};

export const productService = {
    createProductFromDB,
    getAllProductsFromDB,
    getSingleProductsFromDB,
    updateProductById,
    deleteProductById,
  };