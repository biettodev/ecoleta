const express = require('express')
const nunjucks = require('nunjucks')
const db = require('./database/db')
const server = express()
nunjucks.configure('src/view', {
	express: server,
	noCache: true,
})
server.use(express.static('public'))
server.use(express.urlencoded({
	extended: true
}))
server.get( '/', (req, res) => { 
	return res.render('index.html', {
		title: 'Um título'
	})
})
server.get( '/create-point', (req, res) => { 
	return res.render('create-point.html')
})
server.post( '/save-point', (req, res) => {
	const { image, name, address, address2, state, city, items} = req.body
	const query = `
		INSERT INTO places(image, name, address, address2, state, city, items)
		VALUES(?, ?, ?, ?, ?, ?, ?)
	`
	values = [image, name, address, address2, state, city, items]
	function afterInsertData(err){
		if(err){
				return console.log(err)
				return res.send('Erro no cadastro!')
			}
			
		console.log('Cadastrado com sucesso!')
		console.log(this)
		return res.render('create-point.html', {saved: true})
	}
	db.run(query, values, afterInsertData)
})

server.get( '/search', (req, res) => {
	const search = req.query.search
	
	if(search == ''){
		return res.render('search-results.html', {total: 0})		
	}
	
	db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
		if(err){ return console.log(err) }
		console.log(rows)
		const total = rows.length
		return res.render('search-results.html', { places: rows, total: total})
	})
})
server.listen(3000)