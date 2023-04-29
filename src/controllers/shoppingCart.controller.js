import {cart} from "../../models/shoppingCart.model.js";

export const registerProductCart = async (req,res) => {
    const {name, description, price, image} = req.body
    
    try {
            const NewProduct = new cart({name, description, price, image});
            await NewProduct.save()
            console.log('GRaba Ok') 
            return res.status(200).json({ ok: 'Producto Insertado' })  
    } catch (error) {
        console.log(error) 
        return res.status(403).json({ error: 'Error al insertar producto' })          
     }
}

export const listProductsCart = async (req,res) => {
    try {
            const listado = await cart.find()
            return res.status(200).send(listado)
    } catch (error) {
        console.log(error) 
        return res.status(403).json({ error: 'Error al listar productos' })          
     }
}

export const deleteProductCart = async ({ body, params },res) => {
    const id = params.id
    try {
            await cart.deleteOne({_id: id})
            return res.status(200).json({ok:'Producto eliminado correctamente'})
    } catch (error) {
        console.log(error) 
        return res.status(403).json({ error: 'Error al borrar el producto' })          
     }
}

export const emptyProductCart = async (body,res) => {
    try {
            await cart.deleteMany({})
            return res.status(200).json({ok:'Carrito vaciado correctamente'})
    } catch (error) {
        console.log(error) 
        return res.status(403).json({ error: 'Error al vaciar el carrito' })          
     }
}

