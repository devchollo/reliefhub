export const REQUEST_TYPES = {
  FOOD: 'food',
  WATER: 'water',
  SHELTER: 'shelter',
  CLOTHING: 'clothing',
  MEDICAL: 'medical',
  MONEY: 'money',
  OTHER: 'other'
};

export const REQUEST_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  FULFILLED: 'fulfilled',
  CANCELLED: 'cancelled'
};

export const USER_TYPES = {
  INDIVIDUAL: 'individual',
  ORGANIZATION: 'organization',
  COMPANY: 'company',
  GOVERNMENT: 'government'
};

export const BADGE_TYPES = {
  HELPER: 'helper',
  CHAMPION: 'champion',
  HERO: 'hero',
  LEGEND: 'legend',
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum'
};

export const PAYMENT_METHODS = {
  GCASH: 'gcash',
  STRIPE: 'stripe',
  IN_KIND: 'in-kind'
};

export const STRIPE_TEST_CARDS = {
  SUCCESS: '4242424242424242',
  DECLINE: '4000000000000002',
  REQUIRES_AUTH: '4000002500003155',
  INSUFFICIENT_FUNDS: '4000000000009995'
};

export const FEES = {
  PROCESSING_FEE_PERCENT: 2.5,
  PLATFORM_FEE_PER_10: 0.25,
  TOTAL_FEE_PERCENT: 5
};

export const PHILIPPINE_PHONE_REGEX = /^\+63\d{10}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;