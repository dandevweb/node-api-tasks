import { Database } from "./database.js";
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js";
import { taskStoreRequest } from "./requests/task-store-request.js";
import { taskUpdateRequest } from "./requests/task-update-request.js";

const database = new Database;

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: async (req, res) => {
      const { search } = req.query

      const searchData = search ? {
        title: search,
        description: search
      } : null

      const tasks = database.select('tasks', searchData)

      return res.end(JSON.stringify(tasks));
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: async (req, res) => {
      taskStoreRequest(req, res)

      const { title, description, completed_at } = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: async (req, res) => {
      const { id } = req.params

      const task = database.show('tasks', id)

      if (!task?.id) {
        return res.writeHead(400).end(JSON.stringify({ message: 'Tarefa não encontrada' }));
      }

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: async (req, res) => {
      const { id } = req.params

      taskUpdateRequest(req, res, id)

      const task = database.show('tasks', id)

      if (!task?.id) {
        return res.writeHead(400).end(JSON.stringify({ message: 'Tarefa não encontrada' }));
      }

      const { title, description } = req.body
      let data = {}

      if (title) {
        data.title = title
      }
      if (description) {
        data.description = description
      }

      database.update('tasks', id, data)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks/:id'),
    handler: async (req, res) => {
      const { id } = req.params

      const task = database.show('tasks', id)

      return res.end(JSON.stringify(task));
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: async (req, res) => {
      const { id } = req.params


      const task = database.show('tasks', id)

      if (!task?.id) {
        return res.writeHead(400).end(JSON.stringify({ message: 'Tarefa não encontrada' }));
      }

      let completed_at = null;

      if (!task.completed_at) {
        completed_at = new Date()
      }

      database.update('tasks', id, { completed_at })

      return res.writeHead(200).end()
    }
  },
]