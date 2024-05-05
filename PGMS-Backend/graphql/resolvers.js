const { MongoClient } = require('mongodb');
const MONGODB_URI = process.env.MONGODB_URI;

const resolvers = {
  Query: {
    tenantsByPg: async (_, { pgId }) => {
      const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db();
    
    // Using a cursor to fetch tenants by pgId
    const cursor = db.collection('tenants').find({ pgId }).project({ tenantName: 1, monthlyRent: 1 });

    const tenants = [];
    while (await cursor.hasNext()) { // Check if there are more documents
      const tenant = await cursor.next(); // Fetch the next document
      tenants.push(tenant); // Add to the list of tenants
    }

    return tenants;
  } catch (error) {
    console.error('Error fetching tenants:', error);
    throw new Error('Failed to fetch tenants');
  } finally {
    await client.close();
  }
}
    },
  };


module.exports = resolvers;
