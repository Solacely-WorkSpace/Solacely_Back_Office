// This script is for setting admin role to a user
// You would run this script manually or through an admin interface

/*
To use this script:
1. Install Clerk SDK: npm install @clerk/clerk-sdk-node
2. Create this file in your project
3. Add your Clerk secret key to your environment variables
4. Run with: node scripts/set-admin-role.js <user_email>
*/

require('dotenv').config();
const { clerkClient } = require('@clerk/clerk-sdk-node');

async function setAdminRole() {
  const userEmail = process.argv[2];
  
  if (!userEmail) {
    console.error('Please provide a user email as an argument');
    process.exit(1);
  }
  
  try {
    // Find the user by email
    const users = await clerkClient.users.getUserList({
      emailAddress: [userEmail],
    });
    
    if (users.length === 0) {
      console.error(`No user found with email: ${userEmail}`);
      process.exit(1);
    }
    
    const user = users[0];
    
    // Update the user's metadata to include the admin role
    await clerkClient.users.updateUser(user.id, {
      publicMetadata: { role: 'admin' },
    });
    
    console.log(`Successfully set admin role for user: ${userEmail}`);
  } catch (error) {
    console.error('Error setting admin role:', error);
    process.exit(1);
  }
}

setAdminRole();