export function taskStoreRequest(req, res) {
  const errors = [];

  if (!req.body.title) {
    errors.push({ message: 'O título é obrigatório.' });
  }

  if (!req.body.description) {
    errors.push({ message: 'A descrição é obrigatória.' });
  }

  if (typeof req.body.title !== 'string') {
    errors.push({ message: 'O título deve ser uma string' });
  }

  if (typeof req.body.description !== 'string') {
    errors.push({ message: 'A descrição deve ser uma string' });
  }

  if (errors.length > 0) {
    return res.writeHead(400).end(JSON.stringify(errors));
  }

}
