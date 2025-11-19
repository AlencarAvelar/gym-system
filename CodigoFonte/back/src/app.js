const express = require("express")     
const app = express()
const port = 3000


// criação de rota padrão da API rest

app.get('/' , (req,res) => {
    res.send("Ola, Mundo!")
})

// executar a porta 3000

app.listen(port,() => {
    console.log('Servidor rodando na porta http://localhost:${port}')
})




