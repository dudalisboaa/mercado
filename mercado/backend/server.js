const express = require('express');
//aqui é a solicitação do pacote cors, que será usado para a ()
const cors = require('cors');
 
// aqui estou instanciando o pacote express nessa constante "app"
const app = express();
 
//definição da porta que o servidor vai rodar
const port = 4500;
 
app.use(cors());
app.use(express.json());
 
 
//TESTE DE SERIVIDOR
app.listen(port, () => console.log(`Rodando na porta ${port}`));
 
//importar a conexao do banco
const connection = require('./dbconfig');
 
 
//CONFIGURAÇÃO DO MULTER PARA FAZER UPLOAD DE ARQUIVOS NO FOMRULARIO
const path = require('path');

app.post('/usuario/cadastrar', (request, response) => {
    let params = Array(
        request.body.nome,
        request.body.email,
        request.body.senha,
        request.body.cpf_usuario,
        request.body.status_permissão
    );
     
        let query = "INSERT INTO Usuario(nome, email, senha, cpf_usuario, status_permissão) VALUES(?,?,?,?,?);";
        connection.query(query, params, (err, result) => {
            if(result){
                response
                    .status(201)
                    .json({
                        succsses: true,
                        message: "sucesso",
                        data: result
                    });
            } else{
                response
                    .status(400)
                    .json({
                        success: false,
                        message: "erro",
                        data: err
                    })
            }
        });
    }
);
app.get('/usuario/listar', (request, response) => {
    let params = Array(
        request.body.nome,
        request.body.email,
        request.body.senha,
        request.body.cpf_usuario,
        request.body.status_permissão
    );
 
    let query = "SELECT * FROM Usuario";
    connection.query(query, params, (err, result) => {
        if(result){
            response
                .status(201)
                .json({
                    success: true,
                    essage: "sucesso",
                    data: result,
                })
        } else
        response
        .status(400)
        .json({
            success: false,
            message: "erro",
            data: err
        })
    });
});
app.put('/usuario/editar/:id', (request, response) => {
    let params = Array(      
        request.body.nome,
        request.body.email,
        request.body.senha,
        request.body.cpf_usuario,
        request.body.status_permissão,
        request.params.id
    );
 
   
    let query = `UPDATE Usuario
    SET nome = ?,email = ?,senha = ?,cpf_usuario = ?, status_permissão = ?
    where id_usuario = ?`;
 
 
    connection.query(query, params, (err, result) => {
        if(result){
            response
                .status(201)
                .json({
                    message: "sucesso",
                    success: true,
                    data: result
                })
        } else
        response
        .status(400)
        .json({
            success: false,
            message: "erro",
            data: err
        })
    })
 
})
 
app.delete('/usuario/deletar/:id', (request, response) => {
    let params = Array(      
        request.params.id
    );
 
    let query = `DELETE FROM Usuario WHERE id_usuario = ? `;
 
    connection.query(query, params, (err, result) => {
        if(result){
            response
                .status(201)
                .json({
                    message: "sucesso",
                    success: true,
                    data: result
                })
        } else
        response
        .status(400)
        .json({
            success: false,
            message: "erro",
            data: err
        })
    })
})

app.post('/login', (request, response) => {
    let params = Array(
        request.body.email
    )

    let query = "SELECT UsuarioID, nome, email, senha, perfil FROM Usuarios WHERE email = ? ;"

    connection.query(query, params, (err, result) => {
        if (result.length > 0) {
            let senhaDigita = request.body.password
            let senhaBanco = result[0].senha

            if (senhaBanco === senhaDigita) {
                response
                    .status(200)
                    .json({
                        success: true,
                        message: "Sucesso",
                        data: result[0]
                    })
            } else {
                response
                    .status(400)
                    .json({
                        success: false,
                        message: "E-mail não cadastrado"
                    })
            }
        }
    })
})

const multer = require('multer')

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./public")
    },
    filename: function (req, file, cb) {
        let nome_sem_espacos = file.originalname.trim()
        let nome_array = nome_sem_espacos.split(' ')
        let nome_com_underline = nome_array.join('_')
        return cb(null, `${Date.now()}_${nome_com_underline}`)
    }

})

let upload = multer({ storage })

module.exports = upload;

app.post('/produto/cadastrar', upload.single('file'), (request, response) => {
    let params = Array(
        request.body.title,
        request.body.price,
        request.file.filename
    )
})

