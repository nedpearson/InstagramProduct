require('dotenv').config();

async function testToken() {
  const token = process.env.META_ADS_ACCESS_TOKEN;
  if (!token) throw new Error('No token');
  
  const res = await fetch(`https://graph.facebook.com/v18.0/me/accounts?fields=instagram_business_account&access_token=${token}`);
  const data = await res.json();
  
  console.log(JSON.stringify(data, null, 2));
}

testToken().catch(console.error);
