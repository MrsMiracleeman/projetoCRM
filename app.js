import express from 'express';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração para obter __dirname no formato ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações do Servidor
const app = express();
const port = 3001;

// Configurações de e-mail
const user = "rodrigoo.czar@gmail.com";
const pass = "yoqq mgeh idue aasa";

// Desativar rejeição de certificado (cuidado ao usar em produção)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Caminho do arquivo HTML
const caminhoArquivoHTML = path.join(__dirname, 'emailspadroes', 'modelo-email.html');

// Destinatários
const destinatarios = [
    'rodrigoo.czaar@gmail.com',
    'rodrigoo.czar@gmail.com'
];

// Configuração do transporte de e-mail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
    tls: {
        rejectUnauthorized: false, // Aceita certificados auto-assinados
      }
});

// Função para ler o HTML
const lerHTML = async (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (erro, data) => {
            if (erro) {
                reject(erro);
            } else {
                resolve(data);
            }
        });
    });
};

// Rotas
app.get('/', (req, res) => {
    res.send('Olá, mundo! Bem-vindo ao servidor Express.');
});

app.get('/sendEmail', async (req, res) => {

    const { modelo, cliente } = req.query


    try {
        // Lê o conteúdo do arquivo HTML
        //const htmlLido = await lerHTML(caminhoArquivoHTML);
        const htmlLido = await lerHTML(path.join(__dirname, 'emailspadroes', `${modelo}.html`));
        // Configuração do e-mail
        const mailOptions = {
            from: user, // Remetente
            //to: destinatarios.join(','),
            to: cliente,
            subject: 'Terceiro teste',
            html: htmlLido
        };

        // Envia o e-mail
        const info = await transporter.sendMail(mailOptions);

        // Retorna resposta ao cliente
        res.status(200).json({
            message: 'E-mail enviado com sucesso!',
            info
        });
    } catch (erro) {
        console.error('Erro ao enviar e-mail:', erro);
        res.status(500).json({
            message: 'Erro ao enviar o e-mail.',
            error: erro.message
        });
    }
});

// Inicializa o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
