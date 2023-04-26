import { Database } from "./database.js";
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js";
import { taskRequest } from "./requests/task-request.js";

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
      taskRequest(req, res)

      const { title, description, completed_at } = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: new Date(completed_at),
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

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: async (req, res) => {
      const { id } = req.params
      const { name, email } = req.body

      database.update('tasks', id, { name, email })

      return res.writeHead(204).end()
    }
  }
]