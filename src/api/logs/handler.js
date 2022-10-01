const ClientError = require('../../exceptions/ClientError');

class AuthsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.createLog = this.createLog.bind(this);
    this.readLog = this.readLog.bind(this);
  }

  async createLog(r, h) {
    try {
      this._validator.validateLog(r.payload);

      const activityId = await this._service.add(r.payload);

      const response = h.response({
        status: 'success',
        message: 'Aktifitas berhasil ditambahkan.',
        data: {
          activityId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      
      const response = h.response({
        status: 'error',
        message: 'Kegagalan dari Server.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async readLog() {
    
  }
}

module.exports = AuthsHandler;
