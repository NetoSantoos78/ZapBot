const fs = require('fs');
const mysql = require('mysql');
// Função para verificar se um número de contato existe no arquivo admins.txt
function verificarNumeroContato(numeroContato, callback) {
    // Lê o conteúdo do arquivo admins.txt
    
    fs.readFile('admins.txt', 'utf8', (err, data) => {
        if (err) {
            callback(err);
            return;
        }

        // Divide o conteúdo em linhas
        const linhas = data.split('\n');

        // Itera pelas linhas
        for (const linha of linhas) {
            // Divide cada linha em campos usando o separador ';'
            const campos = linha.split(';');

            // O número de contato é o primeiro campo (índice 0)
            const numeroAdmin = campos[0].trim();

            // Verifica se o número de contato existe no arquivo
            if (numeroAdmin === numeroContato) {
                // O número existe e é um administrador
                // callback(null, `Você é um administrador! ⚙️`);
                callback(null, `sim`);
                return;
            }
        }

        // Se o número não foi encontrado, retorne um erro
        callback(new Error(`Você não é um administrador.`));
    });
}


// verificar.js

function verificarDados(login, senha, dias, limite, numeroformatado) {
    // Faça algo com os dados recebidos, como verificar se o usuário é válido
    // e retornar uma resposta adequada.
    console.log(`Dados recebidos: Username: ${login}, Password: ${senha}, Dias: ${dias}, Limite: ${limite}`);
    // Importe a biblioteca mysql
    const mysql = require('mysql');

    // Configuração da conexão com o banco de dados
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'parkinho'
    });

    // Função para conectar ao banco de dados
    function connectToDatabase() {
        return new Promise((resolve, reject) => {
            connection.connect(err => {
                if (err) {
                    console.error('Erro ao conectar ao MySQL:', err);
                    reject(err);
                } else {
                    console.log('Conexão bem-sucedida ao MySQL');
                    resolve();
                }
            });
        });
    }

    // Função para inserir dados na tabela
    function insertData(id, numero, username, password, validade, jaTestou, dataAtual, quantolimite) {
        const sql = 'INSERT INTO `clientespk` (`id`, `numero`, `login`, `senha`, `validade`, `jaTestou`, `diaComprado`, `quantolimite`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

        return new Promise((resolve, reject) => {
            connection.query(sql, [id, numero, username, password, validade, jaTestou, dataAtual, quantolimite], (err, result) => {
                if (err) {
                    console.error('Erro ao inserir os valores:', err);
                    reject(err);
                } else {
                    console.log('Valores inseridos com sucesso na tabela');
                    resolve();
                }
            });
        });
    }
    
    // Uso das funções com Promessas
    connectToDatabase()
    .then(() => {
        const id = null;
        const numero = `${numeroformatado}`;
        const username = `${login}`;
        const password = `${senha}`;
        const validade = new Date();
        const jaTestou = 'sim';
        const dataAtual = new Date();
        const quantolimite = `${limite}`
    
        return insertData(id, numero, username, password, validade, jaTestou, dataAtual, quantolimite);
        
    })
        
        .then(() => {
            // Fechar a conexão com o MySQL após a inserção
            connection.end();
        })
        .catch(err => {
            // Lidar com erros
            console.error('Erro:', err);
            connection.end();
        });

}

function apagarDados(login) {
    // Faça algo com os dados recebidos, como verificar se o usuário é válido
    // e retornar uma resposta adequada.
    console.log(`Dados recebidos: Username: ${login}`);
    // Importe a biblioteca mysql
    const mysql = require('mysql');

    // Configuração da conexão com o banco de dados
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'parkinho'
    });

    // Função para conectar ao banco de dados
    function connectToDatabase() {
        return new Promise((resolve, reject) => {
            connection.connect(err => {
                if (err) {
                    console.error('Erro ao conectar ao MySQL:', err);
                    reject(err);
                } else {
                    console.log('Conexão bem-sucedida ao MySQL');
                    resolve();
                }
            });
        });
    }

    // Função para inserir dados na tabela
    function apagarData(username) {
        const sql = 'DELETE FROM `clientespk` WHERE `login` = ?';
    
        return new Promise((resolve, reject) => {
            connection.query(sql, [username], (err, result) => {
                if (err) {
                    console.error('Erro ao apagar os valores:', err);
                    reject(err);
                } else {
                    console.log('Valores apagados com sucesso na tabela');
                    resolve();
                }
            });
        });
    }
    
    // Uso das funções com Promessas
    connectToDatabase()
    .then(() => {
        const username = `${login}`;
    
        return apagarData(username);
        
    })
        
        .then(() => {
            // Fechar a conexão com o MySQL após a inserção
            connection.end();
        })
        .catch(err => {
            // Lidar com erros
            console.error('Erro:', err);
            connection.end();
        });

}





////////////// Exporta modulos //////////////
module.exports = {
    verificarNumeroContato,
    verificarDados,
    apagarDados
};
