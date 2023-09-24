const fs = require('fs');
const { createShellScriptFile, criarUserTeste, apagarUser, editarDias, editarLimite } = require('./shellUtils');
const { verificarNumeroContato, verificarDados } = require('./verificar');
const { create } = require('@open-wa/wa-automate');

const saudacaoResponse = `Olá, %NAME%!\nSou o assistente virtual do Parkinho.\nTemos vários produtos para oferecer!\nQuer conhecer? Responda com 'Sim' ou 'Não'.`;
const naoResponse = `Tudo bem! Se quiser saber mais sobre nossos serviços, é só perguntar.`;
const simResponse = `Ótimo! Escolha o que deseja fazer:\n1. Comprar\n2. Testar\n3. Renovar\n4. Quero conhecer\n5. Produtos\n6. Ajuda\n7. Quero Revender\nEscolha uma opção da lista .`;


const normalizeText = (text) => {
    return text.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, "");
};

const menuOptions = {
    sim: "Sim",
    nao: "Não"
};

create().then((client) => {
    client.onMessage(async (message) => {
        var atendimento = 0;
        var resp1 = 0;
        var resp2 = 0;
        var resp3 = 0;
        var resp4 = 0;
        var resp5 = 0;
        var resp6 = 0;
        var resp7 = 0;
        var resp8 = 0;
        var resp9 = 0;
        var resp10 = 0;

        const respSemAtendimento = `Desculpe, não entendi sua mensagem. \nVamos iniciar seu atendimento!\nDigite "menu"`;
        const respComprar = `Que ótima noticia 😄 vamos la!\nvou gerar o link de pagamento via pix\nassim que for confirmado irei te enviar os dados de login 😁`;
        const respTestar = `Certo, vou criar um usuário de teste para você!!\nIrei adicioná-lo à lista de clientes! 👍`;
        const respRenovar = `Que bom velo novamente 😄 \nvou gerar o link de pagamento\nassim que for confirmado irei informalo e renovar seu acesso 😁`;
        const respConhecer = `Nossos produtos incluem:\n1. Produto X\n2. Produto Y\nEscolha o número do produto que deseja conhecer.`;
        const respProdutos = `Aqui estão algumas informações sobre nossos produtos:\nProduto A: [Descrição]\nProduto B: [Descrição]`;
        const respAjuda = `Precisa de ajuda?\nEntre em contato conosco em [email ou telefone].`;
        const respRevender = `Interessado em revender nossos produtos?\nEntre em contato conosco em [email ou telefone].`;

        const senderNumber = message.from.split('@')[0]; // Extrair o número do remetente
        const numeroformatado = message.from.split('@')[0];
        global = numeroformatado;
        console.log(`Mensagem de ${senderNumber}:`, message.body);

        const userMessage = normalizeText(message.body);
        const saudacaoList = fs.readFileSync('saudacao.txt', 'utf8').split(';');
        const contactName = message.sender.pushname || 'Cliente';

        let response = '';

        for (const saudacao of saudacaoList) {
            if (userMessage.includes(normalizeText(saudacao))) {
                response = saudacaoResponse.replace('%NAME%', contactName);
                break;
            }
        }
        
        ////////////////// ########################### //////////////////

        ////////////////// ADMINS //////////////////
        ///////// PERMISSAO
        if (userMessage.includes('/admin')) {
            response = `Vou verificar se você é um admin ⚙️`;
            // Exemplo de uso da função
            verificarNumeroContato(numeroformatado, (err, resultado) => {
                if (err) {
                    response = `Erro ao verificar o status de admin: ${err.message}`;
                } else {
                    response = resultado;
                }
                client.sendText(message.from, response).catch(error => console.error(error));
            });
        }
        else if (userMessage.includes('menu')) {
            var atendimento = 1;
            // Use a opção 'quotedMsg' para marcar como resposta à mensagem original
            client.sendTextWithMentions(message.from, saudacaoResponse.replace('%NAME%', contactName), { quotedMsg: message });
        }
        
        else if (userMessage.includes('/gerar')) {
            response = `Certo, vou criar um usuário para você!!\nIrei adicioná-lo à lista de clientes! 👍`;
            verificarNumeroContato(numeroformatado, (err) => {
                if (err) {
                    response = "🚫 Calma ai amigo você não pode fazer isso, somente *admins*";
                } else {
                    createShellScriptFile(numeroformatado, (error, userResponse) => {
                        if (error) {
                            response = `😢 Erro ao criar o usuário: ${error.message}\ntente novamente!!`;
                        } else {
                            response = userResponse;
                        }
                        client.sendText(message.from, response).catch(error => console.error(error));
                        // Aguardar 1 segundo antes de enviar o link
                        setTimeout(() => {
                            const linkResponse = `Baixe o aplicativo 📲: https://play.google.com/store/apps/details?id=com.parkinho`;
                            client.sendText(message.from, linkResponse).catch(error => console.error(error));
                        }, 1000); // 1000 milissegundos = 1 segundo
                    });
                }
                client.sendText(message.from, response).catch(error => console.error(error));
            })
        }

        else if (userMessage.includes('/testar')) {
            response = `Certo, vou criar um usuário de teste para você!!\nIrei adicioná-lo à lista de clientes! 👍`;
            criarUserTeste(numeroformatado, (error, userResponse) => {
                if (error) {
                    response = `😢 Erro ao criar o usuário: ${error.message}`;
                } else {
                    response = userResponse;
                }
                client.sendText(message.from, response).catch(error => console.error(error));

                // Aguardar 1 segundo antes de enviar o link
                setTimeout(() => {
                    const linkResponse = `Baixe o aplicativo 📲: https://play.google.com/store/apps/details?id=com.parkinho`;
                    client.sendText(message.from, linkResponse).catch(error => console.error(error));
                }, 1000); // 1000 milissegundos = 1 segundo
            });
        } 
        else if (userMessage.startsWith('/apagar ')) {
            response = `Certo, vou apagaro este usuário !!`;
            const usernameToDelete = userMessage.replace('/apagar ', ''); // Extrai o nome do usuário após "/apagar "
            verificarNumeroContato(numeroformatado, (err) => {
                if (err) {
                    response = "🚫 Calma ai amigo você não pode fazer isso, somente *admins*";
                } else {
                    apagarUser(usernameToDelete, (error, userResponse) => {
                        if (error) {
                            response = `😢 Erro ao apagar o usuário: ${error.message}`;
                        } else {
                            response = userResponse;
                        }
                        client.sendText(message.from, response).catch(error => console.error(error));
                    });
                }
                client.sendText(message.from, response).catch(error => console.error(error));
            })            
        }
        //////////// EDITAR DIAS ////////////
        else if (userMessage.startsWith('/editardias ')) {
            const params = userMessage.replace('/editardias ', '').split(' '); // Extrai os parâmetros e divide em um array

            if (params.length === 2) {
                const usuarioEditarDias = params[0]; // O primeiro parâmetro é o nome do usuário
                const dias = params[1]; // O segundo parâmetro é o número de dias

                // Agora você pode usar 'usuarioEditarDias' e 'dias' conforme necessário
                // ...

                // Por exemplo, você pode chamar a função 'editarDias' passando ambos os parâmetros
                editarDias(usuarioEditarDias, dias, (error, userResponse) => {
                    if (error) {
                        response = `😢 Erro ao editar o usuário: ${error.message}`;
                    } else {
                        response = userResponse;
                    }
                    client.sendText(message.from, response).catch(error => console.error(error));
                });
            } else {
                // Se o número de parâmetros não for 2, você pode responder com uma mensagem de erro
                response = 'Por favor, forneça um nome de usuário e um número de dias válidos.';
                client.sendText(message.from, response).catch(error => console.error(error));
            }

        }

        //////////// EDITAR LIMITE ////////////
        else if (userMessage.startsWith('/editarlimite ')) {
            const params = userMessage.replace('/editarlimite ', '').split(' '); // Extrai os parâmetros e divide em um array

            if (params.length === 2) {
                const usuarioEditarLimite = params[0]; // O primeiro parâmetro é o nome do usuário
                const limite = params[1]; // O segundo parâmetro é o número de dias

                // Agora você pode usar 'usuarioEditarDias' e 'dias' conforme necessário
                // ...

                // Por exemplo, você pode chamar a função 'editarDias' passando ambos os parâmetros
                editarLimite(usuarioEditarLimite, limite, (error, userResponse) => {
                    if (error) {
                        response = `😢 Erro ao editar o usuário: ${error.message}`;
                    } else {
                        response = userResponse;
                    }
                    client.sendText(message.from, response).catch(error => console.error(error));
                });
            } else {
                // Se o número de parâmetros não for 2, você pode responder com uma mensagem de erro
                response = 'Por favor, forneça um nome de usuário e um número de limite válidos.';
                client.sendText(message.from, response).catch(error => console.error(error));
            }

        } else if (userMessage.includes('sim')) {
            console.log(atendimento);
            // Se o usuário escolher 'Sim', enviamos o menu de opções
            response = simResponse;
            client.sendTextWithMentions(message.from, response, menuOptions).catch(error => console.error(error));
        } else if (userMessage.includes('nao')) {
            response = naoResponse;
            client.sendText(message.from, response).catch(error => console.error(error));
        } 
        
        ////////// Atendimeno //////////
        else if (userMessage.includes('1') || userMessage.includes('comprar') && atendimento === '1') {
            console.log("Viu a compra!!");
            response = respComprar;
        }

        ////////// Atendimeno //////////
        
        else {
            if (response === '') {
                var atendimento = 1;
                response = `Desculpe, não entendi sua mensagem. \nVamos iniciar seu atendimento!\nDigite "menu"`;
            }
            client.sendText(message.from, response).catch(error => console.error(error));
        }
    });
}).catch(err => {
    console.error(err);
});
