const Contato = require('../models/Contato')

exports.index = (request, response) => {
    response.render('novo_contato', {contato: {}})
}

exports.store = async (request, response) => {
    try {
        const contato = new Contato(request.body)
        await contato.register()

        if (contato.errors.length > 0) {
            request.flash('errors', contato.errors)
            request.session.save(() => response.redirect('back'))
            return
        }
        request.flash('success', 'Contato salvo!')
        request.session.save(() => response.redirect(`/contato/${contato.contato._id}`))
    } catch (error) {
        console.log(error)
        response.render('404')
    }
}

exports.edit = async (request, response) => {
    if(!request.params.id) return response.render('404')
    const contato = await Contato.buscaPorId(request.params.id)
    if(!contato) return response.render('404')
    response.render('edit_contato', {contato})
}

exports.update = async (request, response) => {
    try {
        if(!request.params.id) return response.render('404')
        const contato = new Contato(request.body)
        await contato.edit(request.params.id)

        if (contato.errors.length > 0) {
            request.flash('errors', contato.errors)
            request.session.save(() => response.redirect('back'))
            return
        }
        request.flash('success', 'Contato editado com sucesso!')
        request.session.save(() => response.redirect(`/contato/${contato.contato._id}`))
    } catch (error) {
        console.log(error)
        response.render('404')
    }
}

exports.delete = async (request, response) => {
    if(!request.params.id) return response.render('404')
    const contato = await Contato.delete(request.params.id)
    if(!contato) return response.render('404')
    request.flash('success', 'Contato apagado com sucesso!')
    request.session.save(() => response.redirect(`back`))
}