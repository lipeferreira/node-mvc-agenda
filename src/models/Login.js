const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
})

const LoginModel = mongoose.model('Login', LoginSchema)

class Login {
    constructor(body) {
        this.body = body
        this.errors = []
        this.user = null
    }

    cleanup() {
        for (let key in this.body) {
            if(typeof this.body[key] !== 'string'){
                this.body[key] = ''
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        }
    }

    valida() {
        this.cleanup()
        if(!validator.isEmail(this.body.email)) this.errors.push('Email inválido')
        if(this.body.password < 3 || this.body.password >50) this.errors.push('A senha precisa ter entre 3 e 50 caracteres')
    }

    async userExists() {
        const user = await LoginModel.findOne({email: this.body.email})
        if(user) this.errors.push('Email ja cadastrado')
    }

    async register() {
        this.valida()
        if(this.errors.length > 0) return
        await this.userExists()
        if(this.errors.length > 0) return
       
        try {
            const salt = bcrypt.genSaltSync()
            this.body.password = bcrypt.hashSync(this.body.password, salt)
            console.log(this.body)
            this.user = await LoginModel.create(this.body)
        } catch (error) {
            console.log(error)
        }
    }

    async login() {
        this.valida()
        if(this.errors.length > 0) return
        this.user = await LoginModel.findOne({email: this.body.email})

        if(!this.user) {
            this.errors.push('Usuário não existe')
            return
        }
        
        if (!bcrypt.compareSync(this.body.password, this.user.password)) {
            this.errors.push('Senha inválida')
            this.user = null
            return
        }
    }
}

module.exports = Login