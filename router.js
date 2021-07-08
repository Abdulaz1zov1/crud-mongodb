const express = require('express')
const router = express.Router()
const user = require('./controller')
const isAuth = require('./middleware/isAuth')

router.post('/add', user.register)
router.post('/login', user.login)
router.post('/logout', user.logOut)
router.get('/all', isAuth, user.getAll)

router.get('/:id', user.getById)
router.put('/:id', user.updateOne)
router.delete('/:id', user.getByIdDelete)

module.exports = router