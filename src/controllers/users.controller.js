import { Users } from "../../models/users.model.js"
import bcryptjs from "bcryptjs";
import { createTransport } from 'nodemailer';
import jwt from 'jsonwebtoken';
import jwt_decode from "jwt-decode";

const clienteNodemailer = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'santiago.marks@ethereal.email',
        pass: 'nejXJj5DNhjZwtURG5'
    }
});

const TEST_MAIL = 'santiago.marks@ethereal.email'

export const registerUsers = async (req,res) => {
    const {email,password,name,lastname} = req.body
    
    try {
        const user = new Users({email,password,name,lastname});
        await user.save()

        /*
        const mailOptions = {
            from: 'Tercera Entrega',
            to: TEST_MAIL,
            subject: 'Nuevo Usuario Registrado',
            html: '<h1 style="color: blue;">Informe de nuevo usuario registrado<span style="color: green;">'
            + 'Mail Usuario : ' + email + '<br>' +
            + 'Nombre : ' + name + ' ' + lastname + '<br>' +            
            '</span></h1>'
        }
        
        try {
            const info = await clienteNodemailer.sendMail(mailOptions)
            console.log(info)
        } catch (error) {
            console.log(error)
        }
        */
       
        return res.json({ok:true})
    } catch (error) {
       console.log(error) 
    }
}

export const prueba = (req,res) => {
    res.json({ error: 'No existe el usuario registrado' })        
}

export const loginUsers =  async (req,res) => {
    try {
        const {email,password} = req.body        
        let user = await Users.findOne({email})
        if(!user) return res.status(403).json({ error: 'No existe el usuario registrado en la DB' })     
        
        const respuestaPassword = user.comparePassword(password)
        if(! respuestaPassword)
            return res.status(403).json({ error: 'Contraseña incorrecta' })  
            
         const token = jwt.sign({
             name: user.name,
             id: user._id
        }, process.env.TOKEN_SECRET)
            
            res.header('auth-token', token).json({
                error: null,
                data: {token}
            })

        // return res.json({respuesta: 'ok'})
    } catch (error) {
       console.log(error) 
       return res.status(500).json({ error: 'Error del servidor' })               
    }
}

export async function UsersInfo(req,res) 
{
    try {
        const token = req.header('auth-token')        
        // const {email} = body      
        const email = 'alyson.fritsch37@ethereal.email';  
        const decoded =  jwt.decode(token, process.env.TOKEN_SECRET) ; 
        console.log(decoded)
        let user = await Users.findOne({email})
        if(!user) return res.status(403).json({ error: 'No existe el usuario registrado en la DB' })     
        return res.json({respuesta: 'ok' })
    } catch (error) {
       console.log(error) 
       return res.status(500).json({ error: 'Error del servidor' })               
    }     
}