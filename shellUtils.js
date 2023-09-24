const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const { verificarDados, apagarDados } = require('./verificar');

function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

function connectWithRetry(ssh, config, maxRetries, retryInterval) {
    let retries = 0;
    return new Promise((resolve, reject) => {
        const tryConnect = () => {
            ssh.connect(config)
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    if (retries < maxRetries) {
                        retries++;
                        console.error(`Tentativa de conexão falhou. Tentando novamente em ${retryInterval / 1000} segundos...`);
                        setTimeout(tryConnect, retryInterval);
                    } else {
                        reject(err);
                    }
                });
        };
        tryConnect();
    });
}

function executeCommand(ssh, command) {
    return ssh.execCommand(command)
        .then((result) => {
            return result;
        });
}

function createShellScriptFile(numeroformatado, callback) {
    const randomString = generateRandomString(6);
    const randomSenha = generateRandomString(8);

    const scriptPath = './AtlantusMakeAccount.sh';
    const username = `zp${randomString}`;
    const password = `zp${randomSenha}`;
    const dias = '31';
    const limite = '1';

    const command = `${scriptPath} ${username} ${password} ${dias} ${limite}`;

    const scriptContent = `${command}\n`;

    // Crie as instâncias NodeSSH separadas para cada servidor
    const sshServer1 = new NodeSSH();
    const sshServer2 = new NodeSSH();

    // Configurações para conexão SSH
    const sshConfigServer1 = {
        host: '177.85.145.1',
        username: 'root',
        password: 'kp08kp08'
    };

    const sshConfigServer2 = {
        host: '132.226.166.194',
        username: 'root',
        password: 'kp08kp08'
    };

    // Array de Promises para armazenar as promessas de execução em paralelo
    const promises = [];

    // Conecte e execute comandos em ambos os servidores
    promises.push(
        connectWithRetry(sshServer1, sshConfigServer1, 5, 5000)
            .then(() => {
                return executeCommand(sshServer1, `echo "${scriptContent}" > /root/zap/criarusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer1, `chmod +x /root/zap/criarusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer1, `/root/zap/criarusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer1, `rm /root/zap/criarusuario.sh`);
            }).then(() => {
                return sshServer1.dispose(); // Encerre a conexão com o servidor
            })
    );

    promises.push(
        connectWithRetry(sshServer2, sshConfigServer2, 5, 5000)
            .then(() => {
                return executeCommand(sshServer2, `echo "${scriptContent}" > /root/zap/criarusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer2, `chmod +x /root/zap/criarusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer2, `/root/zap/criarusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer2, `rm /root/zap/criarusuario.sh`);
            }).then(() => {
                return sshServer2.dispose(); // Encerre a conexão com o servidor
            })
    );
    
    // Aguarde até que todas as Promises sejam resolvidas
    Promise.all(promises)
    .then(() => {
        verificarDados(username, password, dias, limite, numeroformatado);
        const response = `-- Segue abaixo os dados de acesso --\nLogin: ${username}\nSenha: ${password}\nDias: ${dias}\nLimite: ${limite}\nEste login é permitido em nossos servidores.\nTenha um bom uso`;
        callback(null, response);
    })
    .catch(err => {
        callback(err);
    });

}

function criarUserTeste(numeroformatado, callback) {
    const randomString = generateRandomString(6);
    const randomSenha = generateRandomString(8);
    const scriptPath = './AtlantusMakeAccount.sh';
    const username = `ut${randomString}`;
    const password = `ut${randomSenha}`;
    const dias = '1';
    const limite = '1';

    const command = `${scriptPath} ${username} ${password} ${dias} ${limite}`;

    const scriptContent = `${command}\n`;

    // Crie as instâncias NodeSSH separadas para cada servidor
    const sshServer3 = new NodeSSH();
    const sshServer4 = new NodeSSH();

    // Configurações para conexão SSH
    const sshConfigServer3 = {
        host: '177.85.145.1',
        username: 'root',
        password: 'kp08kp08'
    };

    const sshConfigServer4 = {
        host: '132.226.166.194',
        username: 'root',
        password: 'kp08kp08'
    };

    // Array de Promises para armazenar as promessas de execução em paralelo
    const promises = [];

    // Conecte e execute comandos em ambos os servidores
    promises.push(
        connectWithRetry(sshServer3, sshConfigServer3, 3, 5000)
            .then(() => {
                return executeCommand(sshServer3, `echo "${scriptContent}" > /root/zap/criarusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer3, `chmod +x /root/zap/criarusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer3, `/root/zap/criarusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer3, `rm /root/zap/criarusuario.sh`);
            }).then(() => {
                return sshServer3.dispose(); // Encerre a conexão com o servidor
            })
    );

    promises.push(
        connectWithRetry(sshServer4, sshConfigServer4, 3, 5000)
            .then(() => {
                return executeCommand(sshServer4, `echo "${scriptContent}" > /root/zap/criarusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer4, `chmod +x /root/zap/criarusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer4, `/root/zap/criarusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer4, `rm /root/zap/criarusuario.sh`);
            }).then(() => {
                return sshServer4.dispose(); // Encerre a conexão com o servidor
            })
    );

    // Aguarde até que todas as Promises sejam resolvidas
    Promise.all(promises)
        .then(() => {
            verificarDados(username, password, dias, limite, numeroformatado);
            const response = `-- Segue abaixo os dados de acesso --\nLogin: ${username}\nSenha: ${password}\nDias: ${dias}\nLimite: ${limite}\nEste login é permitido em nossos servidores.\nTenha um bom uso`;
            callback(null, response);
        })
        .catch(err => {
            callback(err);
        });
}

//APAGAR USER
function apagarUser(usuarioApagar, callback) {
    const scriptPath = 'bash remover.sh';

    const command = `${scriptPath} ${usuarioApagar}`;

    const scriptContent = `${command}\n`;

    // Crie as instâncias NodeSSH separadas para cada servidor
    const sshServer3 = new NodeSSH();
    const sshServer4 = new NodeSSH();

    // Configurações para conexão SSH
    const sshConfigServer3 = {
        host: '177.85.145.1',
        username: 'root',
        password: 'kp08kp08'
    };

    const sshConfigServer4 = {
        host: '132.226.166.194',
        username: 'root',
        password: 'kp08kp08'
    };

    // Array de Promises para armazenar as promessas de execução em paralelo
    const promises = [];

    // Conecte e execute comandos em ambos os servidores
    promises.push(
        connectWithRetry(sshServer3, sshConfigServer3, 3, 5000)
            .then(() => {
                return executeCommand(sshServer3, `echo "${scriptContent}" > /root/zap/apagarusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer3, `chmod +x /root/zap/apagarusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer3, `/root/zap/apagarusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer3, `rm /root/zap/apagarusuario.sh`);
            }).then(() => {
                return sshServer3.dispose(); // Encerre a conexão com o servidor
            })
    );

    promises.push(
        connectWithRetry(sshServer4, sshConfigServer4, 3, 5000)
            .then(() => {
                return executeCommand(sshServer4, `echo "${scriptContent}" > /root/zap/apagarusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer4, `chmod +x /root/zap/apagarusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer4, `/root/zap/apagarusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer4, `rm /root/zap/apagarusuario.sh`);
            }).then(() => {
                return sshServer4.dispose(); // Encerre a conexão com o servidor
            })
    );

    // Aguarde até que todas as Promises sejam resolvidas
    Promise.all(promises)
        .then(() => {
            apagarDados(usuarioApagar);
            const response = `*┌────── Tudo feito ──────┐*\n*│* Agora *_${usuarioApagar}_* não tem\n*│* mais acesso aos servidores\n*└──────* ✅✅✅ *──────┘*`;
            callback(null, response);
        })
        .catch(err => {
            callback(err);
        });
}


/////////////////////////    Editar dias    /////////////////////////
function editarDias(usuarioEditar, dias, callback) {
    const scriptPath = 'bash AlterarData.sh';

    const command = `${scriptPath} ${usuarioEditar} ${dias}`;

    const scriptContent = `${command}\n`;

    // Crie as instâncias NodeSSH separadas para cada servidor
    const sshServer3 = new NodeSSH();
    const sshServer4 = new NodeSSH();

    // Configurações para conexão SSH
    const sshConfigServer3 = {
        host: '177.85.145.1',
        username: 'root',
        password: 'kp08kp08'
    };

    const sshConfigServer4 = {
        host: '132.226.166.194',
        username: 'root',
        password: 'kp08kp08'
    };

    // Array de Promises para armazenar as promessas de execução em paralelo
    const promises = [];

    // Conecte e execute comandos em ambos os servidores
    promises.push(
        connectWithRetry(sshServer3, sshConfigServer3, 3, 5000)
            .then(() => {
                return executeCommand(sshServer3, `echo "${scriptContent}" > /root/zap/diasusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer3, `chmod +x /root/zap/diasusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer3, `/root/zap/diasusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer3, `rm /root/zap/diasusuario.sh`);
            }).then(() => {
                return sshServer3.dispose(); // Encerre a conexão com o servidor
            })
    );

    promises.push(
        connectWithRetry(sshServer4, sshConfigServer4, 3, 5000)
            .then(() => {
                return executeCommand(sshServer4, `echo "${scriptContent}" > /root/zap/diasusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer4, `chmod +x /root/zap/diasusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer4, `/root/zap/diasusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer4, `rm /root/zap/diasusuario.sh`);
            }).then(() => {
                return sshServer4.dispose(); // Encerre a conexão com o servidor
            })
    );

    // Aguarde até que todas as Promises sejam resolvidas
    Promise.all(promises)
        .then(() => {
            verificarDados(usuarioEditar, dias);
            const response = `*┌────── Tudo feito ──────┐*\n*│* Você adicionou *_${dias} dia(s)_* \n*│* para o usuario *_${usuarioEditar}_*\n*└──────* ✅✅✅ *──────┘*`;
            callback(null, response);
        })
        .catch(err => {
            callback(err);
        });
}

/////////////////////////    Editar limite    /////////////////////////
function editarLimite(usuarioEditarLimite, limite, callback) {
    const scriptPath = 'bash alterarlimite.sh';

    const command = `${scriptPath} ${usuarioEditarLimite} ${limite}`;

    const scriptContent = `${command}\n`;

    // Crie as instâncias NodeSSH separadas para cada servidor
    const sshServer3 = new NodeSSH();
    const sshServer4 = new NodeSSH();

    // Configurações para conexão SSH
    const sshConfigServer3 = {
        host: '177.85.145.1',
        username: 'root',
        password: 'kp08kp08'
    };

    const sshConfigServer4 = {
        host: '132.226.166.194',
        username: 'root',
        password: 'kp08kp08'
    };

    // Array de Promises para armazenar as promessas de execução em paralelo
    const promises = [];

    // Conecte e execute comandos em ambos os servidores
    promises.push(
        connectWithRetry(sshServer3, sshConfigServer3, 3, 5000)
            .then(() => {
                return executeCommand(sshServer3, `echo "${scriptContent}" > /root/zap/editarusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer3, `chmod +x /root/zap/editarusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer3, `/root/zap/editarusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer3, `rm /root/zap/editarusuario.sh`);
            }).then(() => {
                return sshServer3.dispose(); // Encerre a conexão com o servidor
            })
    );

    promises.push(
        connectWithRetry(sshServer4, sshConfigServer4, 3, 5000)
            .then(() => {
                return executeCommand(sshServer4, `echo "${scriptContent}" > /root/zap/editarusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer4, `chmod +x /root/zap/editarusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer4, `/root/zap/editarusuario.sh`);
            }).then(() => {
                return executeCommand(sshServer4, `rm /root/zap/editarusuario.sh`);
            }).then(() => {
                return sshServer4.dispose(); // Encerre a conexão com o servidor
            })
    );

    // Aguarde até que todas as Promises sejam resolvidas
    Promise.all(promises)
        .then(() => {
            verificarDados(usuarioEditarLimite, limite);
            const response = `*┌────── Tudo feito ──────┐*\n*│* O limite de *_${usuarioEditarLimite}_* \n*│* agora é *_${limite}_*\n*└──────* ✅✅✅ *──────┘*`;
            callback(null, response);
        })
        .catch(err => {
            callback(err);
        });
}

module.exports = { createShellScriptFile, criarUserTeste , apagarUser, editarDias, editarLimite};
