export function taskUpdateRequest(req, res, id) {
  const errors = [];

  if (!id) {
    errors.push({ message: 'O id deve ser informado' });
  }

  if (!req.body.title && !req.body.description) {
    errors.push({
      message: 'Você precisa informar um parametro para ser atualizado.'
    });
  }

  if (errors.length > 0) {
    return res.writeHead(400).end(JSON.stringify(errors));
  }

}
