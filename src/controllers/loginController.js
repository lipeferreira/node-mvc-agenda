const Login = require('../models/Login')

exports.index = (request, response) => {
    if(request.session.user) return response.redirect('/')
    console.log(request.session.user)
    response.render('login')
}

exports.store = async (request, response) => {
    try {
        const login = new Login(request.body)
        await login.register()

        if(login.errors.length > 0) {
            request.flash('errors', login.errors)
            request.session.save(function(){ 
                return response.redirect('back')
            })
            return
        }

        request.flash('success', 'Usuário cadastrado com sucesso')
        request.session.save(function(){ 
            return response.redirect('back')
        })
    } catch (error) {
        console.log(error)
        response.render('404')
    } 
}

exports.login = async (request, response) => {
    try {
        const login = new Login(request.body)
        await login.login()

        if(login.errors.length > 0) {
            request.flash('errors', login.errors)
            request.session.save(function(){ 
                return response.redirect('back')
            })
            return
        }

        request.flash('success', 'Login feito com sucesso')
        request.session.user = login.user
        request.session.save(function(){ 
            return response.redirect('back')
        })
    } catch (error) {
        console.log(error)
        response.render('404')
    } 
}

exports.logout = async (request, response) => {
    request.session.destroy()
    response.redirect('/')
}