import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(err => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }
    return data
  }

  show(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    let data;
    if (rowIndex > -1) {
      data = this.#database[table][rowIndex]

    }

    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist()

    return data;
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      const currentTask = this.#database[table][rowIndex]

      const { title, description, completed_at } = data;
      if (title) {
        currentTask.title = title
      }

      if (description) {
        currentTask.description = description
      }

      currentTask.completed_at = completed_at ?? null

      currentTask.updated_at = new Date();

      this.#database[table][rowIndex] = { id, ...currentTask }
      this.#persist()
    }
  }

}