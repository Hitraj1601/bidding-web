import Joi from 'joi';

// User registration validation
export const validateRegistration = (data) => {
  const schema = Joi.object({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.alphanum': 'Username can only contain letters and numbers',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username cannot exceed 30 characters',
        'any.required': 'Username is required'
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .min(6)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        'any.required': 'Password is required'
      }),
    firstName: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.min': 'First name must be at least 2 characters long',
        'string.max': 'First name cannot exceed 50 characters',
        'any.required': 'First name is required'
      }),
    lastName: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.min': 'Last name must be at least 2 characters long',
        'string.max': 'Last name cannot exceed 50 characters',
        'any.required': 'Last name is required'
      }),
    role: Joi.string()
      .valid('user', 'collector', 'restorer')
      .optional()
  });

  return schema.validate(data);
};

// User login validation
export const validateLogin = (data) => {
  const schema = Joi.object({
    login: Joi.string()
      .required()
      .messages({
        'any.required': 'Email or username is required'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      }),
    remember: Joi.boolean()
      .optional()
  });

  return schema.validate(data);
};

// Item creation validation
export const validateItem = (data) => {
  const schema = Joi.object({
    title: Joi.string()
      .min(5)
      .max(200)
      .required()
      .messages({
        'string.min': 'Title must be at least 5 characters long',
        'string.max': 'Title cannot exceed 200 characters',
        'any.required': 'Title is required'
      }),
    description: Joi.string()
      .min(20)
      .max(2000)
      .required()
      .messages({
        'string.min': 'Description must be at least 20 characters long',
        'string.max': 'Description cannot exceed 2000 characters',
        'any.required': 'Description is required'
      }),
    category: Joi.string()
      .valid('Ancient', 'Medieval', 'Renaissance', 'Victorian', 'Art Deco', 'Modern', 'Coins', 'Jewelry', 'Furniture', 'Art', 'Books', 'Ceramics', 'Textiles', 'Weapons', 'Tools', 'Other')
      .required()
      .messages({
        'any.only': 'Please select a valid category',
        'any.required': 'Category is required'
      }),
    era: Joi.string()
      .required()
      .messages({
        'any.required': 'Era is required'
      }),
    condition: Joi.string()
      .valid('Mint', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor', 'Restoration Required')
      .required()
      .messages({
        'any.only': 'Please select a valid condition',
        'any.required': 'Condition is required'
      }),
    startingPrice: Joi.number()
      .min(0)
      .required()
      .messages({
        'number.min': 'Starting price cannot be negative',
        'any.required': 'Starting price is required'
      }),
    reservePrice: Joi.number()
      .min(0)
      .optional(),
    auctionStart: Joi.date()
      .greater('now')
      .required()
      .messages({
        'date.greater': 'Auction start date must be in the future',
        'any.required': 'Auction start date is required'
      }),
    auctionEnd: Joi.date()
      .greater(Joi.ref('auctionStart'))
      .required()
      .messages({
        'date.greater': 'Auction end date must be after start date',
        'any.required': 'Auction end date is required'
      }),
    origin: Joi.object({
      country: Joi.string().optional(),
      region: Joi.string().optional(),
      city: Joi.string().optional()
    }).optional(),
    dimensions: Joi.object({
      length: Joi.number().min(0).optional(),
      width: Joi.number().min(0).optional(),
      height: Joi.number().min(0).optional(),
      weight: Joi.number().min(0).optional(),
      unit: Joi.string().valid('cm', 'in', 'mm').default('cm')
    }).optional(),
    materials: Joi.array().items(Joi.string()).optional(),
    shipping: Joi.object({
      included: Joi.boolean().default(false),
      cost: Joi.number().min(0).optional(),
      international: Joi.boolean().default(false),
      restrictions: Joi.array().items(Joi.string()).optional()
    }).optional()
  });

  return schema.validate(data);
};

// Bid validation
export const validateBid = (data) => {
  const schema = Joi.object({
    amount: Joi.number()
      .positive()
      .required()
      .messages({
        'number.positive': 'Bid amount must be positive',
        'any.required': 'Bid amount is required'
      }),
    maxBid: Joi.number()
      .positive()
      .min(Joi.ref('amount'))
      .optional()
      .messages({
        'number.positive': 'Maximum bid must be positive',
        'number.min': 'Maximum bid must be greater than or equal to current bid amount'
      }),
    type: Joi.string()
      .valid('standard', 'proxy', 'reserve', 'mystery')
      .default('standard')
  });

  return schema.validate(data);
};

// Auction creation validation
export const validateAuction = (data) => {
  const schema = Joi.object({
    title: Joi.string()
      .min(5)
      .max(200)
      .required()
      .messages({
        'string.min': 'Title must be at least 5 characters long',
        'string.max': 'Title cannot exceed 200 characters',
        'any.required': 'Title is required'
      }),
    description: Joi.string()
      .min(20)
      .max(2000)
      .required()
      .messages({
        'string.min': 'Description must be at least 20 characters long',
        'string.max': 'Description cannot exceed 2000 characters',
        'any.required': 'Description is required'
      }),
    type: Joi.string()
      .valid('standard', 'themed', 'time_capsule', 'mystery', 'estate', 'institutional')
      .default('standard'),
    startDate: Joi.date()
      .greater('now')
      .required()
      .messages({
        'date.greater': 'Auction start date must be in the future',
        'any.required': 'Auction start date is required'
      }),
    endDate: Joi.date()
      .greater(Joi.ref('startDate'))
      .required()
      .messages({
        'date.greater': 'Auction end date must be after start date',
        'any.required': 'Auction end date is required'
      }),
    theme: Joi.object({
      name: Joi.string().optional(),
      description: Joi.string().optional(),
      era: Joi.string().optional(),
      category: Joi.string().optional()
    }).optional(),
    registrationRequired: Joi.boolean().default(true),
    minimumDeposit: Joi.number().min(0).default(0),
    bidderApproval: Joi.boolean().default(false)
  });

  return schema.validate(data);
};

// User profile update validation
export const validateProfileUpdate = (data) => {
  const schema = Joi.object({
    firstName: Joi.string()
      .min(2)
      .max(50)
      .optional(),
    lastName: Joi.string()
      .min(2)
      .max(50)
      .optional(),
    bio: Joi.string()
      .max(500)
      .allow('')
      .optional(),
    phone: Joi.string()
      .pattern(/^[\+]?[1-9][\d]{0,15}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Please provide a valid phone number'
      }),
    location: Joi.object({
      country: Joi.string().optional(),
      city: Joi.string().optional(),
      address: Joi.string().optional()
    }).optional(),
    specializations: Joi.array()
      .items(Joi.string().valid('Ancient', 'Medieval', 'Renaissance', 'Victorian', 'Art Deco', 'Modern', 'Coins', 'Jewelry', 'Furniture', 'Art', 'Books', 'Ceramics', 'Other'))
      .optional(),
    experienceLevel: Joi.string()
      .valid('Beginner', 'Intermediate', 'Expert', 'Professional')
      .optional(),
    notifications: Joi.object({
      email: Joi.boolean().optional(),
      push: Joi.boolean().optional(),
      bidUpdates: Joi.boolean().optional(),
      auctionReminders: Joi.boolean().optional()
    }).optional()
  });

  return schema.validate(data);
};

// Password change validation
export const validatePasswordChange = (data) => {
  const schema = Joi.object({
    currentPassword: Joi.string()
      .required()
      .messages({
        'any.required': 'Current password is required'
      }),
    newPassword: Joi.string()
      .min(6)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
      .required()
      .messages({
        'string.min': 'New password must be at least 6 characters long',
        'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, and one number',
        'any.required': 'New password is required'
      }),
    confirmPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.only': 'Password confirmation does not match',
        'any.required': 'Password confirmation is required'
      })
  });

  return schema.validate(data);
};

// Search filters validation
export const validateSearchFilters = (data) => {
  const schema = Joi.object({
    search: Joi.string().optional(),
    category: Joi.string()
      .valid('Ancient', 'Medieval', 'Renaissance', 'Victorian', 'Art Deco', 'Modern', 'Coins', 'Jewelry', 'Furniture', 'Art', 'Books', 'Ceramics', 'Textiles', 'Weapons', 'Tools', 'Other')
      .optional(),
    era: Joi.string().optional(),
    origin: Joi.string().optional(),
    condition: Joi.string()
      .valid('Mint', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor', 'Restoration Required')
      .optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
    status: Joi.string()
      .valid('active', 'ended', 'upcoming')
      .optional(),
    sortBy: Joi.string()
      .valid('price', 'time', 'popular', 'newest')
      .default('newest'),
    sortOrder: Joi.string()
      .valid('asc', 'desc')
      .default('desc'),
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(20)
  });

  return schema.validate(data);
};

// Contact form validation
export const validateContactForm = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 100 characters',
        'any.required': 'Name is required'
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    subject: Joi.string()
      .min(5)
      .max(200)
      .required()
      .messages({
        'string.min': 'Subject must be at least 5 characters long',
        'string.max': 'Subject cannot exceed 200 characters',
        'any.required': 'Subject is required'
      }),
    message: Joi.string()
      .min(10)
      .max(1000)
      .required()
      .messages({
        'string.min': 'Message must be at least 10 characters long',
        'string.max': 'Message cannot exceed 1000 characters',
        'any.required': 'Message is required'
      })
  });

  return schema.validate(data);
};

export default {
  validateRegistration,
  validateLogin,
  validateItem,
  validateBid,
  validateAuction,
  validateProfileUpdate,
  validatePasswordChange,
  validateSearchFilters,
  validateContactForm
};