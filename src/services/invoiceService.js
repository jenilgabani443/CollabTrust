import crypto from 'crypto';
import Invoice from '../models/Invoice.js';

/**
 * Automatically generates an invoice entry in the Invoice collection for a campaign.
 * Calculates a 5% platform fee and a 95% creator payout.
 * Generates a SHA-256 hash of the invoice data and saves it as cryptographicSignature.
 * 
 * @param {string} campaignId - The ID of the campaign
 * @param {number} totalAmount - Total amount for the campaign
 * @returns {Promise<Object>} The created Invoice document
 */
export const generateInvoiceForCampaign = async (campaignId, totalAmount = 1000) => {
  // 1. Calculate a 5% platform fee and a 95% creator payout
  const platformFee = Math.round(totalAmount * 0.05 * 100) / 100;
  const creatorPayout = Math.round(totalAmount * 0.95 * 100) / 100;

  // 2. Generate a SHA-256 hash of the invoice data (campaignId, totalAmount, platformFee, creatorPayout)
  const invoiceData = {
    campaignId: campaignId.toString(),
    totalAmount,
    platformFee,
    creatorPayout,
    status: 'UNPAID', // Initial invoice status
  };

  const invoiceDataString = JSON.stringify(invoiceData);
  const cryptographicSignature = crypto
    .createHash('sha256')
    .update(invoiceDataString)
    .digest('hex');

  // 3. Create the invoice entry
  const invoice = await Invoice.create({
    campaignId,
    totalAmount,
    platformFee,
    creatorPayout,
    status: 'UNPAID',
    cryptographicSignature,
  });

  return invoice;
};
