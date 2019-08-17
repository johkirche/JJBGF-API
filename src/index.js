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

console.log("PROCESS ENV:", process.env.PRISMA_SECRET);

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

server.express.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

server.start(() =>
  console.log(`GraphQL server is running on http://localhost:4000`)
);
