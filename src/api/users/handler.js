const ClientError = require('../../exceptions/ClientError');
const autoBind = require('auto-bind');
class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    
    autoBind(this);
  }

  async createUser(r, h) {
    this._validator.validateUser(r.payload);
    const userId = await this._service.add(r.payload);

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan.',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async readUserById(r) {
    const user = await this._service.getById(r.params);

    return {
      status: 'success',
      data: {
        user,
      },
    };
  }
}

module.exports = UsersHandler;
