const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {
  APP_SECRET,
  auth,
  isAdmin
} = require('../utils')

async function signup (parent, args, context, info) {
  // 1
  const password = await bcrypt.hash(args.password, 10)
  // 2
  const user = await context.prisma.mutation.createUser({
    data: { ...args,
      password
    }
  }, `{ id }`)

  // 3
  const token = jwt.sign({
    userId: user.id
  }, APP_SECRET)

  // 4
  return {
    token,
    user
  }
}

async function login (parent, args, context, info) {
  // 1
  const user = await context.prisma.query.user({
    where: {
      email: args.email
    }
  }, ` { id password } `)
  if (!user) {
    throw new Error('No such user found')
  }

  // 2
  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({
    userId: user.id
  }, APP_SECRET)

  // 3
  return {
    token,
    user
  }
}

function post (parent, args, context, info) {
  const userId = auth(context)
  return context.prisma.mutation.createPost({
    data: {
      title: args.title,
      content: args.content,
      author: {
        connect: {
          id: userId
        }
      }
    }
  },
  info
  )
}

async function updateRoom (parent, args, context, info) {
  auth(context)
  if (!await isAdmin(context)) {
    throw new Error('Not Authorized!')
  }

  return context.prisma.mutation.updateRoom({
    where: {id: args.id},
    data: {...args}
  })
}

// async function joinGroup (parent, args, context, info) {
//   auth(context)
//   if (!await isAdmin(context)) {
//     throw new Error('Not Authorized!')
//   }

//   return context.prisma.mutation.updateRoom({
//     where: {
//       id: args.id
//     },
//     data: { ...args
//     }
//   })
// }

module.exports = {
  signup,
  login,
  post,
  updateRoom
}
