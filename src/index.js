require("dotenv").config();
const { GraphQLServer } = require("graphql-yoga");
const { Prisma } = require("prisma-binding");

const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const AuthPayload = require("./resolvers/AuthPayload");

const resolvers = {
  Query,
  Mutation,
  AuthPayload
};

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "https://prisma.jjbg-kitawo.de",
  secret: process.env.PRISMA_SECRET
});

const server = new GraphQLServer({
  typeDefs: "src/schema.graphql",
  resolvers,
  context: req => ({
    ...req,
    prisma
  })
});
server.start(() =>
  console.log(`GraphQL server is running on http://localhost:4000`)
);
