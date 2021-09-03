exports.checkCsrfError = (error, request, response, next) => {
    if(error && error.code === 'EBADCSRFTOKEN') {
        return response.render('404')
    }
    next()
}

exports.csrfMiddleware = (request, response, next) => {
    response.locals.csrfToken = request.csrfToken()
    next()
}

exports.middlewareGlobal = (request, response, next) => {
    response.locals.errors = request.flash('errors')
    response.locals.success = request.flash('success')
    response.locals.user = request.session.user
    next()
}

exports.loginRequired = (request, response, next) => {
    if(!request.session.user) {
        request.flash('errors', 'Você precisa estar logado para acessar essa rota')
        request.session.save(() => response.redirect('/'))
        return
    }
    next()
}