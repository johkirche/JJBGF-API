const jwt = require('jsonwebtoken')
const APP_SECRET = 'GraphQL-is-aw3some'

function auth (context) {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const {
      userId
    } = jwt.verify(token, APP_SECRET)
    return userId
  }

  throw new Error('Not authenticated')
}

async function isAdmin (context) {
  const userId = auth(context)
  const result = await context.prisma.query.user({
    where: {
      id: userId
    }
  }, '{admin}')
  return result.admin
}

module.exports = {
  APP_SECRET,
  auth,
  isAdmin
}
