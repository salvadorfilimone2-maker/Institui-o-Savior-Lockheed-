/* =====================================================
   SISTEMA DE GESTÃO ACADÉMICA
   SCRIPT PRINCIPAL
===================================================== */


/* =====================================================
   FUNÇÕES GERAIS
===================================================== */

function obterDados(chave) {
    return JSON.parse(localStorage.getItem(chave)) || [];
}


function guardarDados(chave, dados) {
    localStorage.setItem(chave, JSON.stringify(dados));
}


function gerarId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}


/* =====================================================
   ADMINISTRADOR PADRÃO
===================================================== */

const ADMIN = {
    id: 1,
    nome: "Administrador",
    username: "admin",
    password: "1234",
    tipo: "Administrador",
    estado: "Ativo"
};


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

function inicializarSistema() {

    if (!localStorage.getItem("administrador")) {

        localStorage.setItem(
            "administrador",
            JSON.stringify(ADMIN)
        );

    }

    if (!localStorage.getItem("alunos")) {
        guardarDados("alunos", []);
    }

    if (!localStorage.getItem("cadastrosPendentes")) {
        guardarDados("cadastrosPendentes", []);
    }

    if (!localStorage.getItem("professores")) {
        guardarDados("professores", []);
    }

    if (!localStorage.getItem("cursos")) {
        guardarDados("cursos", []);
    }

    if (!localStorage.getItem("turmas")) {
        guardarDados("turmas", []);
    }

    if (!localStorage.getItem("disciplinas")) {
        guardarDados("disciplinas", []);
    }

    if (!localStorage.getItem("matriculas")) {
        guardarDados("matriculas", []);
    }

    if (!localStorage.getItem("notas")) {
        guardarDados("notas", []);
    }

    if (!localStorage.getItem("horarios")) {
        guardarDados("horarios", []);
    }
}

inicializarSistema();


/* =====================================================
   LOGIN
===================================================== */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const username =
                document.getElementById(
                    "username"
                ).value.trim();


            const password =
                document.getElementById(
                    "password"
                ).value;


            const mensagem =
                document.getElementById(
                    "loginMessage"
                );


            const administrador =
                JSON.parse(
                    localStorage.getItem(
                        "administrador"
                    )
                );


            /* =========================
               LOGIN ADMINISTRADOR
            ========================= */

            if (
                administrador &&
                username === administrador.username &&
                password === administrador.password
            ) {

                localStorage.setItem(
                    "utilizadorLogado",
                    JSON.stringify(
                        administrador
                    )
                );


                mensagem.textContent =
                    "Login realizado com sucesso.";

                mensagem.style.color =
                    "green";


                setTimeout(function() {

                    window.location.href =
                        "admin.html";

                }, 500);


                return;
            }


            /* =========================
               LOGIN ALUNO
            ========================= */

            const alunos =
                obterDados("alunos");


            const aluno =
                alunos.find(function(item) {

                    return (
                        item.username === username &&
                        item.password === password &&
                        item.estado === "Ativo"
                    );

                });


            if (aluno) {

                localStorage.setItem(
                    "utilizadorLogado",
                    JSON.stringify(aluno)
                );


                mensagem.textContent =
                    "Login realizado com sucesso.";

                mensagem.style.color =
                    "green";


                setTimeout(function() {

                    window.location.href =
                        "usuario.html";

                }, 500);


                return;
            }


            /* =========================
               LOGIN INCORRETO
            ========================= */

            mensagem.textContent =
                "Utilizador ou senha incorretos.";

            mensagem.style.color =
                "red";

        }
    );

}


/* =====================================================
   ABRIR CADASTRO
===================================================== */

function abrirCadastro() {

    window.location.href =
        "cadastro.html";

}


/* =====================================================
   CADASTRO DO ALUNO
===================================================== */

const cadastroForm =
    document.getElementById(
        "cadastroForm"
    );


if (cadastroForm) {

    cadastroForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const nome =
                document.getElementById(
                    "nome"
                ).value.trim();


            const dataNascimento =
                document.getElementById(
                    "dataNascimento"
                ).value;


            const sexo =
                document.getElementById(
                    "sexo"
                ).value;


            const email =
                document.getElementById(
                    "email"
                ).value.trim();


            const username =
                document.getElementById(
                    "novoUsername"
                ).value.trim();


            const password =
                document.getElementById(
                    "novaPassword"
                ).value;


            const confirmar =
                document.getElementById(
                    "confirmarPassword"
                ).value;


            const mensagem =
                document.getElementById(
                    "cadastroMessage"
                );


            /* SENHAS */

            if (password !== confirmar) {

                mensagem.textContent =
                    "As senhas não coincidem.";

                mensagem.style.color =
                    "red";

                return;
            }


            /* VERIFICAR UTILIZADOR */

            const alunos =
                obterDados("alunos");


            const pendentes =
                obterDados(
                    "cadastrosPendentes"
                );


            const administrador =
                JSON.parse(
                    localStorage.getItem(
                        "administrador"
                    )
                );


            const usernameExiste =
                alunos.some(function(aluno) {

                    return aluno.username
                        .toLowerCase() ===
                        username.toLowerCase();

                }) ||

                pendentes.some(function(aluno) {

                    return aluno.username
                        .toLowerCase() ===
                        username.toLowerCase();

                }) ||

                (
                    administrador &&
                    administrador.username
                        .toLowerCase() ===
                    username.toLowerCase()
                );


            if (usernameExiste) {

                mensagem.textContent =
                    "Este nome de utilizador já existe.";

                mensagem.style.color =
                    "red";

                return;
            }


            /* NOVO CADASTRO */

            const novoCadastro = {

                id: gerarId(),

                nome: nome,

                dataNascimento:
                    dataNascimento,

                sexo: sexo,

                email: email,

                username: username,

                password: password,

                tipo: "Aluno",

                estado: "Pendente",

                dataCadastro:
                    new Date().toLocaleString()

            };


            pendentes.push(
                novoCadastro
            );


            guardarDados(
                "cadastrosPendentes",
                pendentes
            );


            mensagem.textContent =
                "Cadastro enviado com sucesso! Aguarde a aprovação do administrador.";

            mensagem.style.color =
                "green";


            cadastroForm.reset();

        }
    );

}


/* =====================================================
   VERIFICAR ADMIN
===================================================== */

function verificarAdministrador() {

    const utilizador =
        JSON.parse(
            localStorage.getItem(
                "utilizadorLogado"
            )
        );


    if (
        !utilizador ||
        utilizador.tipo !== "Administrador"
    ) {

        window.location.href =
            "index.html";

        return false;
    }


    return true;
}


/* =====================================================
   VERIFICAR ALUNO
===================================================== */

function verificarAluno() {

    const utilizador =
        JSON.parse(
            localStorage.getItem(
                "utilizadorLogado"
            )
        );


    if (
        !utilizador ||
        utilizador.tipo !== "Aluno"
    ) {

        window.location.href =
            "index.html";

        return false;
    }


    return true;
}


/* =====================================================
   ADMIN — NAVEGAÇÃO
===================================================== */

function mostrarPagina(id) {

    const paginas =
        document.querySelectorAll(
            ".pagina"
        );


    paginas.forEach(function(pagina) {

        pagina.style.display =
            "none";

    });


    const pagina =
        document.getElementById(id);


    if (pagina) {

        pagina.style.display =
            "block";

    }
}


/* =====================================================
   ADMIN — CADASTROS PENDENTES
===================================================== */

function mostrarCadastros() {

    const lista =
        document.getElementById(
            "listaCadastros"
        );


    if (!lista) {
        return;
    }


    const pendentes =
        obterDados(
            "cadastrosPendentes"
        );


    lista.innerHTML = "";


    const contador =
        document.getElementById(
            "contadorCadastros"
        );


    const totalPendentes =
        document.getElementById(
            "totalPendentes"
        );


    if (contador) {
        contador.textContent =
            pendentes.length;
    }


    if (totalPendentes) {
        totalPendentes.textContent =
            pendentes.length;
    }


    if (pendentes.length === 0) {

        lista.innerHTML =
            "<p>Não existem cadastros pendentes.</p>";

        return;
    }


    pendentes.forEach(function(aluno) {

        const div =
            document.createElement(
                "div"
            );


        div.className =
            "card";


        div.innerHTML = `

            <h3>
                👨‍🎓 ${aluno.nome}
            </h3>

            <p>
                <strong>Email:</strong>
                ${aluno.email}
            </p>

            <p>
                <strong>Utilizador:</strong>
                ${aluno.username}
            </p>

            <p>
                <strong>Sexo:</strong>
                ${aluno.sexo}
            </p>

            <p>
                <strong>Data de nascimento:</strong>
                ${aluno.dataNascimento}
            </p>

            <p>
                <strong>Data do cadastro:</strong>
                ${aluno.dataCadastro}
            </p>

            <button
                onclick="aceitarCadastro(${aluno.id})">

                ✅ Aceitar

            </button>

            <button
                onclick="rejeitarCadastro(${aluno.id})">

                ❌ Rejeitar

            </button>

        `;


        lista.appendChild(div);

    });

}


/* =====================================================
   ACEITAR CADASTRO
===================================================== */

function aceitarCadastro(id) {

    let pendentes =
        obterDados(
            "cadastrosPendentes"
        );


    const aluno =
        pendentes.find(function(item) {

            return item.id === id;

        });


    if (!aluno) {
        return;
    }


    aluno.estado =
        "Ativo";


    let alunos =
        obterDados("alunos");


    alunos.push(aluno);


    pendentes =
        pendentes.filter(function(item) {

            return item.id !== id;

        });


    guardarDados(
        "alunos",
        alunos
    );


    guardarDados(
        "cadastrosPendentes",
        pendentes
    );


    alert(
        "Cadastro aprovado com sucesso!"
    );


    mostrarCadastros();

    mostrarAlunos();

    atualizarDashboard();

}


/* =====================================================
   REJEITAR CADASTRO
===================================================== */

function rejeitarCadastro(id) {

    const confirmar =
        confirm(
            "Deseja realmente rejeitar este cadastro?"
        );


    if (!confirmar) {
        return;
    }


    let pendentes =
        obterDados(
            "cadastrosPendentes"
        );


    pendentes =
        pendentes.filter(function(item) {

            return item.id !== id;

        });


    guardarDados(
        "cadastrosPendentes",
        pendentes
    );


    mostrarCadastros();

    atualizarDashboard();

}


/* =====================================================
   ALUNOS
===================================================== */

function mostrarAlunos(lista = null) {

    const tabela =
        document.getElementById(
            "tabelaAlunos"
        );


    if (!tabela) {
        return;
    }


    const alunos =
        lista || obterDados("alunos");


    tabela.innerHTML = "";


    if (alunos.length === 0) {

        tabela.innerHTML = `

            <tr>

                <td colspan="6">
                    Nenhum aluno encontrado.
                </td>

            </tr>

        `;

        return;
    }


    alunos.forEach(function(aluno, index) {

        const tr =
            document.createElement("tr");


        tr.innerHTML = `

            <td>
                ${index + 1}
            </td>

            <td>
                ${aluno.nome}
            </td>

            <td>
                ${aluno.email}
            </td>

            <td>
                ${aluno.username}
            </td>

            <td>
                ${aluno.estado}
            </td>

            <td>

                <button
                    onclick="verAluno(${aluno.id})">

                    👁️

                </button>

                <button
                    onclick="editarAluno(${aluno.id})">

                    ✏️

                </button>

                <button
                    onclick="eliminarAluno(${aluno.id})">

                    🗑️

                </button>

            </td>

        `;


        tabela.appendChild(tr);

    });


    const total =
        document.getElementById(
            "totalAlunos"
        );


    if (total) {

        total.textContent =
            obterDados("alunos").length;

    }

}


/* =====================================================
   PESQUISAR ALUNOS
===================================================== */

function pesquisarAlunos() {

    const campo =
        document.getElementById(
            "pesquisaAluno"
        );


    if (!campo) {
        return;
    }


    const texto =
        campo.value
            .toLowerCase()
            .trim();


    const alunos =
        obterDados("alunos");


    const resultado =
        alunos.filter(function(aluno) {

            return (

                aluno.nome
                    .toLowerCase()
                    .includes(texto)

                ||

                aluno.email
                    .toLowerCase()
                    .includes(texto)

                ||

                aluno.username
                    .toLowerCase()
                    .includes(texto)

            );

        });


    mostrarAlunos(resultado);

}


/* =====================================================
   VER ALUNO
===================================================== */

function verAluno(id) {

    const alunos =
        obterDados("alunos");


    const aluno =
        alunos.find(function(item) {

            return item.id === id;

        });


    if (!aluno) {
        return;
    }


    alert(

        "DADOS DO ALUNO\n\n" +

        "Nome: " +
        aluno.nome +

        "\nEmail: " +
        aluno.email +

        "\nUtilizador: " +
        aluno.username +

        "\nData de nascimento: " +
        aluno.dataNascimento +

        "\nSexo: " +
        aluno.sexo +

        "\nEstado: " +
        aluno.estado

    );

}


/* =====================================================
   EDITAR ALUNO
===================================================== */

function editarAluno(id) {

    let alunos =
        obterDados("alunos");


    const aluno =
        alunos.find(function(item) {

            return item.id === id;

        });


    if (!aluno) {
        return;
    }


    const nome =
        prompt(
            "Nome completo:",
            aluno.nome
        );


    if (nome === null) {
        return;
    }


    const email =
        prompt(
            "Email:",
            aluno.email
        );


    if (email === null) {
        return;
    }


    aluno.nome =
        nome.trim();


    aluno.email =
        email.trim();


    guardarDados(
        "alunos",
        alunos
    );


    mostrarAlunos();

}


/* =====================================================
   ELIMINAR ALUNO
===================================================== */

function eliminarAluno(id) {

    const confirmar =
        confirm(
            "Deseja realmente eliminar este aluno?"
        );


    if (!confirmar) {
        return;
    }


    let alunos =
        obterDados("alunos");


    alunos =
        alunos.filter(function(aluno) {

            return aluno.id !== id;

        });


    guardarDados(
        "alunos",
        alunos
    );


    mostrarAlunos();

    atualizarDashboard();

}


/* =====================================================
   PROFESSORES
===================================================== */

function mostrarProfessores() {

    const tabela =
        document.getElementById(
            "tabelaProfessores"
        );


    if (!tabela) {
        return;
    }


    const professores =
        obterDados(
            "professores"
        );


    const pesquisa =
        document.getElementById(
            "pesquisaProfessor"
        );


    const texto =
        pesquisa
            ? pesquisa.value.toLowerCase()
            : "";


    tabela.innerHTML = "";


    professores
        .filter(function(professor) {

            return professor.nome
                .toLowerCase()
                .includes(texto);

        })
        .forEach(function(professor, index) {

            const tr =
                document.createElement("tr");


            tr.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${professor.nome}
                </td>

                <td>
                    ${professor.email}
                </td>

                <td>
                    ${professor.disciplina}
                </td>

                <td>

                    <button
                        onclick="editarProfessor(${professor.id})">

                        ✏️

                    </button>

                    <button
                        onclick="eliminarProfessor(${professor.id})">

                        🗑️

                    </button>

                </td>

            `;


            tabela.appendChild(tr);

        });

}


function adicionarProfessor() {

    const nome =
        prompt(
            "Nome do professor:"
        );


    if (!nome) {
        return;
    }


    const email =
        prompt(
            "Email:"
        );


    if (!email) {
        return;
    }


    const disciplina =
        prompt(
            "Disciplina:"
        );


    if (!disciplina) {
        return;
    }


    const professores =
        obterDados(
            "professores"
        );


    professores.push({

        id: gerarId(),

        nome: nome,

        email: email,

        disciplina: disciplina

    });


    guardarDados(
        "professores",
        professores
    );


    mostrarProfessores();

    atualizarDashboard();

}


function editarProfessor(id) {

    const professores =
        obterDados(
            "professores"
        );


    const professor =
        professores.find(function(item) {

            return item.id === id;

        });


    if (!professor) {
        return;
    }


    const nome =
        prompt(
            "Nome:",
            professor.nome
        );


    if (nome === null) {
        return;
    }


    professor.nome =
        nome;


    guardarDados(
        "professores",
        professores
    );


    mostrarProfessores();

}


function eliminarProfessor(id) {

    if (
        !confirm(
            "