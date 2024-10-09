//importar pacote do mysql
 
const mysql = require("mysql2");
 
// Criar conexão com o mysql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MelS2809',
    database: 'Mercado',
});
 
connection.connect((err) => {
    if(err){
        throw err;              
    } else{
        console.log("banco conectado");
    }
});
 
//
module.exports = connection;
