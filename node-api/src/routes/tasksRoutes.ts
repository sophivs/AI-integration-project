import { Router, Request, Response } from "express";
import { TasksRepository } from "../repositories/tasksRepository";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = Router();
const tasksRepository = new TasksRepository();
const pythonServiceUrl = process.env.PYTHON_LLM_URL;
const SUPPORTED_LANGUAGES = ["pt", "en", "es"];

// POST: Cria uma tarefa e solicita resumo ao serviço Python
router.post("/", async (req: Request, res: Response) => {
  try {
    const { text, lang } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Campo "text" é obrigatório.' });
    }

    if (!lang || !SUPPORTED_LANGUAGES.includes(lang)) {
      return res.status(400).json({ error: "Language not supported" });
    }

    if (!pythonServiceUrl) {
      return res.status(500).json({ error: "Serviço de resumo não configurado." });
    }

    // Cria a "tarefa"
    const task = tasksRepository.createTask({ text, lang });

    // Deve solicitar o resumo do texto ao serviço Python
    const { data } = await axios.post(`${pythonServiceUrl}/summarize`, { text, lang });

    // Atualiza a tarefa com o resumo
    tasksRepository.updateTask(task.id, { summary: data.summary });

    return res.status(201).json({
      message: "Tarefa criada com sucesso!",
      task: tasksRepository.getTaskById(task.id),
    });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    return res
        .status(500)
        .json({ error: "Ocorreu um erro ao criar a tarefa." });
  }
});

// GET: Lista todas as tarefas
router.get("/", (req, res) => {
  const tasks = tasksRepository.getAllTasks();
  return res.json(tasks);
});

// GET: Recebe uma tarefa pelo ID
router.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const task = tasksRepository.getTaskById(id);

  if (!task) {
    return res.status(404).json({ error: "Tarefa não encontrada." });
  }

  return res.json(task);
});

// DELETE: Deleta uma tarefa pelo ID
router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const removed = tasksRepository.deleteTask(id);

  if (!removed) {
    return res.status(404).json({ error: "Tarefa não encontrada." });
  }

  return res.status(200).json({ message: "Tarefa removida com sucesso." });
});

export default router;
