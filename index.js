import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path';

const app = express();

// Configuração do servidor

app.use(express.static(path.join(process.cwd(), './pages/public')));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'M1nhaChav3S3cr3t4',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 30 // Sessão válida por 30 minutos
    }
}));


let usuarios = [];
let mensagens = [];


function verificarAutenticacao(req, res, next) {
    if (req.session.usuarioLogado) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Funções para o sistema
function loginPage(req, res) {
    res.sendFile(path.join(process.cwd(), './pages/public/login.html'));
}

function autenticarUsuario(req, res) {
    const { usuario, senha } = req.body;
    if (usuario === 'admin' && senha === '123') {
        req.session.usuarioLogado = true;
        res.cookie('dataHoraUltimoLogin', new Date().toLocaleString(), { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });
        res.redirect('/');
    } else {
        res.send(`
            <div style="text-align: center; margin-top: 20px;">
                <p style="color: red;">Usuário ou senha inválidos</p>
                <a href="/login" style="text-decoration: none;">Tentar novamente</a>
            </div>
        `);
    }
}

function menu(req, res) {
    const dataHoraUltimoLogin = req.cookies['dataHoraUltimoLogin'] || '';
    res.send(`
        <html>
            <head>
                <title>Menu do Sistema</title>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
                    h1 { color: #333; }
                    a { text-decoration: none; color: #007bff; }
                    a:hover { text-decoration: underline; }
                    ul { list-style: none; padding: 0; }
                    li { margin: 10px 0; }
                </style>
            </head>
            <body>
                <h1>Menu</h1>
                <p>Último acesso: ${dataHoraUltimoLogin}</p>
                <ul>
                    <li><a href="/cadastroUsuario">Cadastro de Usuários</a></li>
                    <li><a href="/batepapo">Bate-papo</a></li>
                    <li><a href="/logout">Logout</a></li>
                </ul>
            </body>
        </html>
    `);
}

function cadastroUsuario(req, res) {
    if (req.method === 'POST') {
        const { nome, nascimento, apelido } = req.body;
        if (!nome || !nascimento || !apelido) {
            res.send(`<p>Todos os campos são obrigatórios!</p><a href="/cadastroUsuario">Voltar</a>`);
        } else {
            usuarios.push({ nome, nascimento, apelido });
            res.redirect('/cadastroUsuario');
        }
    } else {
        res.send(`
            <html>
                <head>
                    <title>Cadastro de Usuários</title>
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
                        h1 { color: #333; }
                        form { max-width: 400px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                        label { display: block; margin-bottom: 8px; }
                        input { width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; }
                        button { padding: 10px 20px; background-color: #007bff; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
                        button:hover { background-color: #0056b3; }
                        a { text-decoration: none; color: #007bff; }
                    </style>
                </head>
                <body>
                    <h1>Cadastro de Usuários</h1>
                    <form method="POST" action="/cadastroUsuario">
                        <label>Nome:</label>
                        <input type="text" name="nome" required><br>
                        <label>Data de Nascimento:</label>
                        <input type="date" name="nascimento" required><br>
                        <label>Apelido:</label>
                        <input type="text" name="apelido" required><br>
                        <button type="submit">Cadastrar</button>
                    </form>
                    <h2>Usuários Cadastrados:</h2>
                    <ul>
                        ${usuarios.map(u => `<li>${u.nome} (${u.apelido})</li>`).join('')}
                    </ul>
                    <a href="/">Voltar ao Menu</a>
                </body>
            </html>
        `);
    }
}

function batePapo(req, res) {
    if (req.method === 'POST') {
        const { mensagem, de, para } = req.body;

        
        if (!mensagem || !de || !para) {
            return res.send(`
                <div style="text-align: center; margin-top: 20px;">
                    <p style="color: red;">Todos os campos são obrigatórios!</p>
                    <a href="/batepapo" style="text-decoration: none;">Voltar</a>
                </div>
            `);
        }

        mensagens.push({ de, para, mensagem });
        res.redirect('/batepapo');
    } else {
        
        const listaUsuarios = usuarios.map(u => `<option value="${u.nome}">${u.nome}</option>`).join('');

        res.send(`
            <html>
                <head>
                    <title>Bate-papo</title>
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
                        h1 { color: #333; }
                        ul { list-style: none; padding: 0; }
                        li { margin: 10px 0; background: #fff; padding: 10px; border-radius: 4px; box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); }
                        form { display: flex; margin-top: 20px; flex-wrap: wrap; }
                        input, select { flex: 1; padding: 8px; margin-right: 10px; border: 1px solid #ccc; border-radius: 4px; }
                        select { max-width: 200px; }
                        button { padding: 10px 20px; background-color: #007bff; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
                        button:hover { background-color: #0056b3; }
                        a { text-decoration: none; color: #007bff; }
                    </style>
                </head>
                <body>
                    <h1>Bate-papo</h1>
                    <ul>
                        ${mensagens.map(m => `<li><strong>${m.de}</strong> para <strong>${m.para}</strong>: ${m.mensagem}</li>`).join('')}
                    </ul>
                    <form method="POST" action="/batepapo">
                        <label>De:</label>
                        <select name="de" required>
                            <option value="">Selecione o remetente</option>
                            ${listaUsuarios}
                        </select><br>
                        <label>Para:</label>
                        <select name="para" required>
                            <option value="">Selecione o destinatário</option>
                            ${listaUsuarios}
                        </select><br>
                        <label>Mensagem:</label>
                        <input type="text" name="mensagem" required><br>
                        <button type="submit">Enviar</button>
                    </form>
                    <a href="/">Voltar ao Menu</a>
                </body>
            </html>
        `);
    }
}

app.get('/login', loginPage);
app.post('/login', autenticarUsuario);
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});
app.get('/', verificarAutenticacao, menu);
app.get('/cadastroUsuario', verificarAutenticacao, cadastroUsuario);
app.post('/cadastroUsuario', verificarAutenticacao, cadastroUsuario);
app.get('/batepapo', verificarAutenticacao, batePapo);
app.post('/batepapo', verificarAutenticacao, batePapo);

const porta = 3000;
app.listen(porta, () => {
    console.log(`Servidor iniciado e em execução na porta ${porta}`);
});
