const express  = require('express')
const { getUsersController, getusersByIdController, createUsersController, loginUsersController, registerUserController, getUserCountController, deleteUserByIdController } = require('../controllers/users')

const router = express.Router()

router.get(`/`, getUsersController)

router.get('/:id', getusersByIdController)

router.post('/', createUsersController)

router.post('/login', loginUsersController)

router.post('/register', registerUserController)

router.get('/get/count', getUserCountController)

router.delete("/:id", deleteUserByIdController)

module.exports = router