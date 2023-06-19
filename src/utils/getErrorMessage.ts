type ErrorWithMessage = {
  message: string
}

export default function getErrorMesssage(error: ErrorWithMessage) {
  if (error.message.startsWith("MongoServerError: E11000")) {
   error.message = "Email already exists"
  }
  return error
}