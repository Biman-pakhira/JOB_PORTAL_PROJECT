const { MongoClient } = require('mongodb');
require('dotenv').config();

async function main() {
  const uri = process.env.DATABASE_URL;
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

  try {
    console.log('Testing connection with Native MongoDB Driver...');
    console.log('URI:', uri.replace(/:([^@]+)@/, ':****@')); // Hide password
    await client.connect();
    console.log('Connected successfully to server');
    
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log('Collections in database:', collections.map(c => c.name));
    
    const admins = await db.collection('Admin').find({}).limit(1).toArray();
    console.log('Query test successful. Admin count:', admins.length);
  } catch (err) {
    console.log('\n--- CONNECTION FAILED ---');
    console.log('Error Name:', err.name);
    console.log('Error Message:', err.message);
    if (err.message.includes('Server selection timed out')) {
      console.log('\nDIAGNOSIS: This is almost certainly an IP Whitelist issue in MongoDB Atlas.');
    }
  } finally {
    await client.close();
  }
}

main();
