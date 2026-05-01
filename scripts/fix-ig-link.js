const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixIgLink() {
  // 1. Get the workspace
  const workspace = await prisma.workspace.findFirst();
  if (!workspace) {
    console.log("No workspace found");
    return;
  }

  // 2. Set the IntegrationToken
  const userToken = 'EAALj4sNH4zIBRTyfvgFhYW6p9tadqHvahjj8rFWmKyQRXgIDCPkPGtR7o0psyp0TbPgSKd70xQqZA7vY3K0DbpMdHcoXmDZB9tBnjA8gA6l6Mcy8MuO4rwg2dzIO9QxgPUVrISbiZBTYhGEtwLIPnC49uK5YbE7QZAkUWZCRKF610cg8iKY2eyW94vXHAvK7XcQEKbaNxszVXpu6InLdwNGTxVTkL8PtDVrQ10FgZBbXB9vWx914dx7Wo9Wf1qRHP1ALWYg7t0nmZANY4pV7yOTO2jtEDmUY7JzUDcZD';
  
  const existingToken = await prisma.integrationToken.findFirst({ where: { provider: 'meta_graph' } });
  if (existingToken) {
    await prisma.integrationToken.update({
      where: { id: existingToken.id },
      data: { encryptedToken: userToken }
    });
  } else {
    await prisma.integrationToken.create({
      data: {
        workspaceId: workspace.id,
        provider: 'meta_graph',
        encryptedToken: userToken
      }
    });
  }

  // 3. Set the InstagramAccount
  const pageAccessToken = 'EAALj4sNH4zIBRbd8ztfZByrxdlxfZBQx9ZA4yXP1bD1NZAlxF6nN9pi9eOwacD13ZCSzzKhc0ZClnFQH9ibwrQJm2hFjw3yFmR1wdZANsRZCI1TMapHADKNCCyD06ZAnbwUNVXKZA4YQ96kZAxiMhxNLBWvC36xfFipAzdq92NEAb5JdBChHfmDAAlY2I4ul5pKR8Ihyp23dPsQ7NUVgHYEJkpWNs3L9HlY0ZBAu936WobmXIe6pumQntznSV6ZCv';
  const igAccountId = '17841433962510105';
  
  const existingAccount = await prisma.instagramAccount.findFirst({ where: { igAccountId } });
  if (existingAccount) {
    await prisma.instagramAccount.update({
      where: { id: existingAccount.id },
      data: {
        accessToken: pageAccessToken,
        username: 'instaflow.app'
      }
    });
  } else {
    await prisma.instagramAccount.create({
      data: {
        workspaceId: workspace.id,
        igAccountId: igAccountId,
        username: 'instaflow.app',
        accessToken: pageAccessToken
      }
    });
  }
  
  console.log("Successfully fixed Meta integration and Instagram Account linkage!");
  await prisma.$disconnect();
}

fixIgLink().catch(console.error);
