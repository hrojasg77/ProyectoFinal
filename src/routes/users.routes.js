import { Router } from "express";
import {loginUsers, registerUsers, prueba, UsersInfo} from "../controllers/users.controller.js"
import {verifyToken} from  "./validate-token.js"

const router = Router()

router.get('/prueba', prueba)

router.post('/api/sessions', loginUsers)

// router.post('/api/users/register', registerUsers)
router.post('/api/users', verifyToken, registerUsers)

router.get('/api/users', UsersInfo)

export default router