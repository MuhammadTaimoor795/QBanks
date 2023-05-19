class ApiError extends Error {
  status;
  constructor(message, options) {
    super(message, { cause: options?.cause });
    this.status = options?.status;
  }
}

// async function getApiError(response) {
//   const body = await response.json();
//   return new ApiError(body.msg || "server_error", {
//     status: body?.status,
//   });
// }

module.exports = { ApiError };
//throw new ApiError("abc",{status:200})
