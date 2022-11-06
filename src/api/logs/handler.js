const autoBind = require('auto-bind');
class LogsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    
    autoBind(this);
  }

  async createLog(r, h) {
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
  }
}

module.exports = LogsHandler;
