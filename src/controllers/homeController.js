const Home = require('../models/Home')
const Contato = require('../models/Contato')

exports.index = async (request, response) => {
    const contatos = await Contato.buscaContatos()
    response.render('index', {contatos})
}