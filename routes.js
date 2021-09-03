const express = require('express')
const route = express.Router()

const homeController = require('./src/controllers/homeController')
const loginController = require('./src/controllers/loginController')
const contatoController = require('./src/controllers/contatoController')

const {loginRequired} = require('./src/middlewares/middleware')

//rotas home
route.get('/', homeController.index)

//rotas login
route.get('/login', loginController.index)
route.post('/login/register', loginController.store)
route.post('/login', loginController.login)
route.get('/logout', loginController.logout)

//rotas contato
route.get('/contato', loginRequired, contatoController.index)
route.get('/contato/:id', loginRequired, contatoController.edit)
route.post('/contato/register', contatoController.store)
route.post('/contato/:id', loginRequired, contatoController.update)
route.get('/contato/apagar/:id', loginRequired, contatoController.delete)

module.exports = route