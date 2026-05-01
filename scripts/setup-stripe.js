const Stripe = require('stripe');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createPlan(name, amount, interval) {
  const product = await stripe.products.create({ name });
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: amount,
    currency: 'usd',
    recurring: { interval },
  });
  return price.id;
}

async function main() {
  console.log('Creating Stripe products...');
  try {
    const proMonthly = await createPlan('Pro Monthly', 4900, 'month');
    const proAnnual = await createPlan('Pro Annual', 49000, 'year');
    const agencyMonthly = await createPlan('Agency Monthly', 14900, 'month');
    const agencyAnnual = await createPlan('Agency Annual', 149000, 'year');
    
    console.log('Created prices:');
    console.log('STRIPE_PRICE_PRO_MONTHLY=' + proMonthly);
    console.log('STRIPE_PRICE_PRO_ANNUAL=' + proAnnual);
    console.log('STRIPE_PRICE_AGENCY_MONTHLY=' + agencyMonthly);
    console.log('STRIPE_PRICE_AGENCY_ANNUAL=' + agencyAnnual);

    // Update .env
    let envContent = fs.readFileSync('.env', 'utf8');
    envContent += `\n\n# STRIPE PRICES\nSTRIPE_PRICE_PRO_MONTHLY=${proMonthly}\nSTRIPE_PRICE_PRO_ANNUAL=${proAnnual}\nSTRIPE_PRICE_AGENCY_MONTHLY=${agencyMonthly}\nSTRIPE_PRICE_AGENCY_ANNUAL=${agencyAnnual}\n`;
    fs.writeFileSync('.env', envContent);
    console.log('.env updated successfully.');
  } catch (err) {
    console.error(err);
  }
}

main();
