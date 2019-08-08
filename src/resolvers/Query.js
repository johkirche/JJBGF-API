const {
  auth,
  isAdmin
} = require('../utils')

function rooms (parent, args, context, info) {
  return context.prisma.query.rooms({}, info)
}

function dates (parent, args, context, info) {
  return context.prisma.query.dates({
    where: {},
    orderBy: 'date_ASC'
  }, info)
}

function room (parent, args, context, info) {
  return context.prisma.query.room({
    where: {
      id: args.id,
    }
  },
  info)
}

function posts (parent, args, context, info) {
  const userId = auth(context)

  return context.prisma.query.posts({
    where: {
      author: {
        id: userId
      }
    }
  }, info)
}

async function users (parent, args, context, info) {
  auth(context)
  if (!await isAdmin(context)) {
    throw new Error('Not Authorized!')
  }
  return context.prisma.query.users({}, info)
}

function user (parent, args, context, info) {
  auth(context)
  return context.prisma.query.user({
    where: {
      id: args.id,
      posts
    }
  },
  info
  )
}

module.exports = {
  user,
  posts,
  users,
  rooms,
  room,
  dates
}
