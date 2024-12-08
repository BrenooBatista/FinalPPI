import express from 'express';
import session from 'express-session';

import cookieParser from 'cookie-parser';
import path from "path";

const app = express();

app.use(express.static(path.join(process.cwd(), './pages/public')));

app.use(session({
    secret:'M1nhaChav3S3cr3t4',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 30
    }
}));

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use(express.static('./pages/public'));

const porta = 3000;
const host = '0.0.0.0';

var listaProdutos = [];

function cadastroProduto(req, resp) {
    resp.send(`
            <html>
                <head>
                    <title>Cadastro de Produtos</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                </head>
                <body>
                    <div class="container text-center">
                    <h1 class="mb-3">Cadastro de Produtos</h1>
                    <form method="POST" action="/cadastrarProduto" class="border p-3 row g-3" novalidate>
                        <div class="col-md-4">
                            <label for="nome" class="form-label">Produto</label>
                            <input type="text" class="form-control" id="nome" name="nome" placeholder="Digite o nome do produto">
                            </div>
                            <div class="col-md-4">
                                <label for="categoria" class="form-label">Categoria</label>
                                <input type="text" class="form-control" id="categoria" name="categoria" placeholder="Digite a categoria do produto">
                            
                            </div>
                            <div class="col-md-4">
                            <label for="tag" class="form-label">Tag</label>
                            <div class="input-group has-validation">
                                <input type="number" class="form-control" id="tag" name="tag" placeholder="Digite o número da tag">
                             </div>
                        </div>
                <div class="col-md-3 mx-auto" >
                    <label for="quantidade" class="form-label">Quantidade</label>
                    <input type="number" class="form-control" id="" name="quantidade">
                </div>
                <div class="col-12">
                    <button class="btn btn-primary" type="submit">Cadastrar</button>
                </div>
                </form>
                    </div>
                </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
            </html>
        `);
}

function menu(req, resp) {
    const  dataHoraUltimoLogin = req.cookies['dataHoraUltimoLogin'];
    if(!dataHoraUltimoLogin){
        dataHoraUltimoLogin='';
    }
    resp.send(`
            <html>
                <head>
                    <title>Cadastro de Produtos</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                </head>
                <body>
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">MENU</a>
                    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <ul class="navbar-nav">
                            <a class="nav-link active" aria-current="page" href="/cadastrarProduto">Cadastrar Produtos</a>
                             <a class="nav-link active" aria-current="page" href="/logout">Logout</a>
                            <a class="nav-link disabled" aria-disabled="true">Seu último acesso foi feito em ${dataHoraUltimoLogin}</a>
                    </div>
                    </div>
                </nav>
                </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
            </html>
        `);
}

function cadastrarProduto(req, resp) {
    const nome = req.body.nome;
    const categoria = req.body.categoria;
    const tag = req.body.tag;
    const quantidade = req.body.quantidade;

    const  dataHoraUltimoLogin = req.cookies['dataHoraUltimoLogin'];
    if(!dataHoraUltimoLogin){
        dataHoraUltimoLogin='';
    }

    if (nome && categoria && tag && quantidade > 0) {

        const produto = { nome, categoria, tag, quantidade };

        listaProdutos.push(produto);

        resp.write(`
        <html>
            <head>
                <title>Produtos Cadastrados</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                <meta charset="utf-8">
            </head>
            <body>
            <div class="container">
                <h1 class="mb-3">Produtos Cadastrados</h1>
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Nome</th>
                            <th scope="col">Categoria</th>
                            <th scope="col">Tag</th>
                            <th scope="col">Quantidade</th>
                        </tr>
                    </thead>
                    <tbody>
    `);

        for (var i = 0; i < listaProdutos.length; i++) {
            resp.write(`
            <tr>
                <td>${listaProdutos[i].nome}</td>
                <td>${listaProdutos[i].categoria}</td>
                <td>${listaProdutos[i].tag}</td>
                <td>${listaProdutos[i].quantidade}</td>
            </tr>
                 `);
        }

        resp.write(`
                    </tbody>
                </table>
                <a class="btn btn-warning" href="/cadastrarProduto" role="button">Continuar Cadastro</a>
                <a class="btn btn-secondary" href="/" role="button">Menu</a>
            </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        </html>
     `);
    }
    else{
        resp.write(`
            <html>
                <head>
                    <title>Cadastro de Produtos</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                    <meta charset="utf-8">
                </head>
                <body>
                    <div class="container text-center">
                    <h1 class="mb-3">Cadastro de Produtos</h1>
                    <form method="POST" action="/cadastrarProduto" class="border p-3 row g-3" novalidate>
                        <div class="col-md-4">
                            <label for="nome" class="form-label">Produto</label>
                            <input type="text" class="form-control" id="nome" name="nome" placeholder="Digite o nome do produto" value="${nome}">
            `);
            if(!nome){
                resp.write(`
                    <div>
                        <span><p class="text-danger">Por favor, esse campo precisa ser preenchido com o nome do produto</p></span>
                    </div>
                    `);
            }
            resp.write(`
                </div>
                    <div class="col-md-4">
                    <label for="categoria" class="form-label">Categoria</label>
                    <input type="text" class="form-control" id="categoria" name="categoria" placeholder="Digite a categoria do produto" value="${categoria}">
                `);
            if(!categoria){
                resp.write(`
                    <div>
                        <span><p class="text-danger">Por favor, esse campo precisa ser preenchido com a categoria do produto</p></span>
                    </div>
                    `);
            }
            resp.write(`
                </div>
                    <div class="col-md-4">
                    <label for="tag" class="form-label">Tag</label>
                    <div class="input-group has-validation">
                    <input type="number" class="form-control" id="tag" name="tag" placeholder="Digite o número da tag" value="${tag}">
                `);
            if(!tag){
                resp.write(`
                    <div>
                        <span><p class="text-danger">Por favor, esse campo precisa ser preenchido com o número da tag do produto</p></span>
                    </div>
                    `);
            }
            resp.write(`
                </div>
            </div>
            <div class="col-md-3 mx-auto" >
                <label for="quantidade" class="form-label">Quantidade</label>
                <input type="number" class="form-control" id="" name="quantidade" value="${quantidade}">
                `);
            if(!quantidade){
                resp.write(`
                    <div>
                        <span><p class="text-danger">Por favor, esse campo precisa ser preenchido com valor mínimo de 1</p></span>
                    </div>
                    `);
            }
            resp.write(`
                </div>
            <div class="col-12">
                <button class="btn btn-primary" type="submit">Cadastrar</button>
                </div>
                </form>
                    </div>
                     <div>
                        <p><span>Seu último acesso foi feito em ${dataHoraUltimoLogin}</span></p>
                    </div>
                </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
            </html>
                `);    

    }

    resp.end();
}

function autenticarUsuario(req, resp){
    const usuario = req.body.usuario;
    const senha = req.body.senha;

    if(usuario === 'admin' && senha === '123'){
        req.session.usuarioLogado = true;
        resp.cookie('dataHoraUltimoLogin', new Date().toLocaleString(), {maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true});
        resp.redirect('/');
    }
    else{
        resp.send(`
            
                <html> 
                    <head>
                        <meta charset="utf-8">
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                            integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                    </head>
                    <body> 
                        <div class = "container w-25">
                            <div class="alert alert-danger" role="alert">Usuário ou Senha inválidos.</div>
                            <div>
                            <a href="/login.html" class="btn btn-secondary">Tentar novamente</a>
                            </div>
                        </div>    
                    </body>
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"crossorigin="anonymous">
                    </script>
                </html>
        `);
        
    }
}

function verificarAutenticacao(req, resp, next){
    if(req.session.usuarioLogado){
        next();
    }
    else
    {
        resp.redirect('/login.html');
    }
}

app.get('/login' , (req, resp) =>{
    resp.redirect('/login.html');
});
app.get('/logout' , (req, resp) =>{
    req.session.destroy();
    resp.redirect('/login.html');
});
app.post('/login' ,autenticarUsuario);
app.get('/',verificarAutenticacao, menu);
app.get('/cadastrarProduto',verificarAutenticacao, cadastroProduto);
app.post('/cadastrarProduto',verificarAutenticacao, cadastrarProduto);
app.listen(porta, host, () => {
    console.log(`Servidor iniciado e em execução no endereço http://${host}:${porta}`);
});