import 'server-only'

import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const PLAN_PRICE_ID = {
    'seeker_pro': 'price_1UTttTHJHDZ27RSyFj9WJOcM',
    'seeker_premium': 'price_1UU4yPHJHDZ27RSyL7OwIruE',
    'recruiter_growth': 'price_1UU4zcHJHDZ27RSyqTbxCdwq',
    'recruiter_enterprise': 'price_1UU50eHJHDZ27RSyaB2gOX1H'
}