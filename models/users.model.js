import { Schema, model } from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    password : {
        type: String,
        required: true
    },
    name: {
        type:  String,
        required: true        
    },
    lastname : {
        type:  String,
        required: true        
    },
    image: {
        type:  String,
        required: false                
    },
    admin: {
        type:  Boolean,
        default: false
    }
})

userSchema.pre("save", async function(next){
    const user = this

    if( ! user.isModified('password')) return next()

    try {
        const salta = await bcryptjs.genSalt(10)
        user.password = await bcryptjs.hash(user.password,salta)
            next()
    } catch (error) {
        console.log(error)
        throw new error('Falló el hash de contraseña')         
    }
})

userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcryptjs.compare(candidatePassword, this.password)
}

export const Users = model('users',userSchema)