const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Tenant {
    tenantName: String
    monthlyRent: String
    pgName: String
  }

  type Query {
    tenantsByPg(pgId: String!): [Tenant]
  }
`;

module.exports = typeDefs;
