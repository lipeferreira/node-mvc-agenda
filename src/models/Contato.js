const mongoose = require('mongoose')
const validator = require('validator')

const ContatoSchema = new mongoose.Schema({
    name: {type: String, required: true},
    lastname: {type: String, required: false, default: ''},
    email: {type: String, required: false, default: ''},
    phone: {type: String, required: false, default: ''},
    createdAt: {type: Date, default: Date.now},
    descricao: String
})

const ContatoModel = mongoose.model('Contato', ContatoSchema)

function Contato(body) {
    this.body = body
    this.errors = []
    this.contato = null
}

Contato.buscaPorId = async id => {
    if (typeof id !== 'string') return
    const contato = await ContatoModel.findById(id)
    return contato
}

Contato.buscaContatos = async () => {
    const contatos = await ContatoModel.find().sort({createdAt: -1})
    return contatos
}

Contato.delete = async id => {
    if (typeof id !== 'string') return
    const contato = await ContatoModel.findOneAndDelete({_id: id})
    return contato
}

Contato.prototype.register = async function(){
    this.valida()
    if(this.errors.length > 0) return
    this.contato = await ContatoModel.create(this.body)
}

Contato.prototype.valida = function() {
    this.cleanUp()
    if(!this.body.name) this.errors.push('Nome é um campo obrigatorio')
    if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('Email inválido')
    if(!this.body.email && !this.body.phone) this.errors.push('Pelo menos um contato precisa ser enviado: Email ou Telefone') 
}

Contato.prototype.cleanUp = function(){
    for (let key in this.body) {
        if(typeof this.body[key] !== 'string'){
            this.body[key] = ''
        }
    }

    this.body = {
        name: this.body.name,
        lastname: this.body.lastname,
        email: this.body.email,
        phone: this.body.phone
    }
}

Contato.prototype.edit = async function(id) {
    if (typeof id !== 'string') return
    this.valida()
    if(this.errors.length > 0) return
    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, {new:true})
}

module.exports = Contato