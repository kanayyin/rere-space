export class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
  static badRequest(msg) { return new ApiError(400, 'BAD_REQUEST', msg); }
  static unauthorized(msg = 'Belum login.') { return new ApiError(401, 'UNAUTHORIZED', msg); }
  static forbidden(msg = 'Akses ditolak.') { return new ApiError(403, 'FORBIDDEN', msg); }
  static notFound(msg = 'Tidak ditemukan.') { return new ApiError(404, 'NOT_FOUND', msg); }
  static conflict(msg) { return new ApiError(409, 'CONFLICT', msg); }
}
