import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    productId: { type: String, trim: true },
    name : { type: String},
    description: { type:  String },
    price : { type:  Number },
    image: { type:  String }
})

export const cart = model('cartSchema',cartSchema)