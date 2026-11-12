import express from "express";
import { lerMensagens, salvarMensagens } from "./store.js"

const app = express();
const PORT = 3000;

app.get("/", (req, res) => res.send("Servidor rodando! 🚀"));
app.get("/status", (req, res) => res.json({ status: "online", sprint: 4 }));
app.get("/sobre", (req, res) => res.send("Mensageiro Local com Node.js. Express e ES Modules."));

app.get("/mensagens", async (req, res) => {
  try { res.json(await lerMensagens()); }
  catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Não foi possível ler as mensagens." });
  }
});

app.get("/mensagens/:id", async (req, res) => {
  try {
    const lista = await lerMensagens();
    const mensagem = lista.find(m => m.id === Number(req.params.id));
    if (!mensagem) return res.status(404).json({ erro: "Mensagem não encontrada." });
    res.json(mensagem);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Falha ao consultar mensagem." });
  }
});

app.get("/total-mensagens", async (req, res) => {
  try { res.json({ total: (await lerMensagens()).length }); }
  catch (erro) { res.status(500).json({ erro: "Falha na contagem." }); }
});

app.get("/exemplo-salvar", async (req, res) => {
  try {
    const lista = await lerMensagens();
    lista.push({id: Date.now(), usuario: "Exemplo", texto: "Gravado em arquivo!"});
    await salvarMensagens(lista);
    res.json({ aviso: "Exemplo didático gravado", total: lista.length });
  } catch (error) {
    console.error(erro);
    res.status(500).json({erro: "Erro ao gravar arquivo."});
  }
});

app.listen(PORT, () => {console.log(`Servidor em http://localhost:${PORT}`);
});