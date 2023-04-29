import { Schema, model } from "mongoose";

const ordersSchema = new Schema({
    id: { type: String, trim: true },
    fecha : { type: timestamp },
    idCliente : { type: String},
      prods: [ { prod: { id, nameprod, description, price, image, }, cant: 2 } ]
})

export const ProductsModel = model('productsSchema',productsSchema)