import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  PhotoIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  TagIcon,
  InformationCircleIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const CreateListing = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data watchers
  const watchedFields = watch();

  const categories = [
    'Furniture',
    'Ceramics & Pottery',
    'Silver & Metalwork',
    'Glass & Crystal',
    'Paintings & Art',
    'Jewelry',
    'Books & Manuscripts',
    'Textiles & Rugs',
    'Sculptures',
    'Coins & Currency',
    'Stamps',
    'Musical Instruments',
    'Scientific Instruments',
    'Militaria',
    'Other'
  ];

  const conditions = [
    { value: 'excellent', label: 'Excellent', description: 'Like new, no visible wear' },
    { value: 'very-good', label: 'Very Good', description: 'Minimal wear, fully functional' },
    { value: 'good', label: 'Good', description: 'Some wear, good condition overall' },
    { value: 'fair', label: 'Fair', description: 'Noticeable wear, may need restoration' },
    { value: 'poor', label: 'Poor', description: 'Significant damage, restoration required' }
  ];

  const auctionTypes = [
    { value: 'standard', label: 'Standard Auction', description: 'Traditional bidding with reserve price' },
    { value: 'no-reserve', label: 'No Reserve', description: 'Item sells to highest bidder regardless of price' },
    { value: 'buy-now', label: 'Buy It Now', description: 'Fixed price, immediate purchase available' },
    { value: 'mystery', label: 'Mystery Auction', description: 'Anonymous bidding until reveal threshold' }
  ];

  const handleImageUpload = (files) => {
    const newImages = Array.from(files).slice(0, 10 - images.length);
    const imageUrls = newImages.map(file => ({
      file,
      url: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));
    setImages([...images, ...imageUrls]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeImage = (imageId) => {
    setImages(images.filter(img => img.id !== imageId));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Here you would typically upload images and submit data to your API
      console.log('Form data:', data);
      console.log('Images:', images);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to success page or item page
      navigate('/dashboard', { 
        state: { message: 'Your listing has been created successfully!' }
      });
    } catch (error) {
      console.error('Error creating listing:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(Math.min(step + 1, 4));
  const prevStep = () => setStep(Math.max(step - 1, 1));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Listing</h1>
          <p className="text-gray-600">Share your antique treasures with fellow collectors</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNum < step 
                    ? 'bg-green-500 text-white' 
                    : stepNum === step 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-300 text-gray-600'
                }`}>
                  {stepNum < step ? (
                    <CheckCircleIcon className="w-5 h-5" />
                  ) : (
                    stepNum
                  )}
                </div>
                {stepNum < 4 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    stepNum < step ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <div className="text-sm text-gray-600">
              Step {step} of 4: {
                step === 1 ? 'Basic Information' :
                step === 2 ? 'Images & Media' :
                step === 3 ? 'Auction Details' :
                'Review & Submit'
              }
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Victorian Sterling Silver Tea Set"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    rows={4}
                    {...register('description', { required: 'Description is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Detailed description of your item, including history, condition, and any notable features..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    {...register('category', { required: 'Category is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition *
                  </label>
                  <select
                    {...register('condition', { required: 'Condition is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select condition</option>
                    {conditions.map((condition) => (
                      <option key={condition.value} value={condition.value}>
                        {condition.label}
                      </option>
                    ))}
                  </select>
                  {errors.condition && (
                    <p className="text-red-500 text-sm mt-1">{errors.condition.message}</p>
                  )}
                  {watchedFields.condition && (
                    <p className="text-gray-500 text-sm mt-1">
                      {conditions.find(c => c.value === watchedFields.condition)?.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age/Period
                  </label>
                  <input
                    type="text"
                    {...register('period')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Victorian (1837-1901)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Origin/Country
                  </label>
                  <input
                    type="text"
                    {...register('origin')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., England, France, China"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maker/Artist
                  </label>
                  <input
                    type="text"
                    {...register('maker')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Mappin & Webb"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Materials
                  </label>
                  <input
                    type="text"
                    {...register('materials')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Sterling Silver, Oak, Porcelain"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    {...register('dimensions')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 25cm H x 30cm W x 15cm D"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Next Step
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Images & Media */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Images & Media</h2>
              
              {/* Image Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  isDragOver ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Photos</h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop your images here, or click to browse
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium cursor-pointer transition-colors duration-200"
                >
                  Choose Images
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  Up to 10 images, max 5MB each (JPG, PNG, GIF)
                </p>
              </div>

              {/* Image Preview Grid */}
              {images.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Uploaded Images ({images.length}/10)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-xs">
                            Primary
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={images.length === 0}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Auction Details */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Auction Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auction Type *
                  </label>
                  <div className="space-y-3">
                    {auctionTypes.map((type) => (
                      <label key={type.value} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          {...register('auctionType', { required: 'Auction type is required' })}
                          value={type.value}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{type.label}</div>
                          <div className="text-sm text-gray-600">{type.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.auctionType && (
                    <p className="text-red-500 text-sm mt-1">{errors.auctionType.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Starting Bid ($) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      {...register('startingBid', { required: 'Starting bid is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="100"
                    />
                    {errors.startingBid && (
                      <p className="text-red-500 text-sm mt-1">{errors.startingBid.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reserve Price ($)
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      {...register('reservePrice')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Optional"
                    />
                    <p className="text-gray-500 text-sm mt-1">
                      Minimum price you'll accept (hidden from bidders)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Auction Duration *
                    </label>
                    <select
                      {...register('duration', { required: 'Duration is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select duration</option>
                      <option value="3">3 days</option>
                      <option value="5">5 days</option>
                      <option value="7">7 days</option>
                      <option value="10">10 days</option>
                      <option value="14">14 days</option>
                    </select>
                    {errors.duration && (
                      <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Value ($)
                    </label>
                    <input
                      type="text"
                      {...register('estimatedValue')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., 500-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    {...register('tags')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Victorian, Silver, Tea Service (comma separated)"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Help buyers find your item with relevant tags
                  </p>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register('featured')}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Feature this listing (+$25)
                    </span>
                  </label>
                  <p className="text-gray-500 text-sm mt-1 ml-6">
                    Get premium placement and increased visibility
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Review Listing
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Review & Submit</h2>
              
              <div className="space-y-6">
                {/* Listing Preview */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Listing Preview</h3>
                  
                  {images.length > 0 && (
                    <img
                      src={images[0].url}
                      alt="Primary"
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                  )}
                  
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-gray-900">{watchedFields.title}</h4>
                    <p className="text-gray-600">{watchedFields.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>Category: {watchedFields.category}</span>
                      <span>Condition: {conditions.find(c => c.value === watchedFields.condition)?.label}</span>
                      {watchedFields.period && <span>Period: {watchedFields.period}</span>}
                    </div>
                    
                    <div className="text-2xl font-bold text-purple-600">
                      Starting at ${watchedFields.startingBid}
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Terms & Conditions</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <label className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        {...register('agreeTerms', { required: 'You must agree to terms' })}
                        className="mt-0.5"
                      />
                      <span>
                        I agree to the platform's terms of service and seller agreement
                      </span>
                    </label>
                    <label className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        {...register('agreeAuthenticity', { required: 'Authentication agreement required' })}
                        className="mt-0.5"
                      />
                      <span>
                        I warrant that all information provided is accurate and the item is authentic
                      </span>
                    </label>
                    <label className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        {...register('agreeFees')}
                        className="mt-0.5"
                      />
                      <span>
                        I understand the fee structure (5% final value fee + payment processing)
                      </span>
                    </label>
                  </div>
                  {(errors.agreeTerms || errors.agreeAuthenticity) && (
                    <p className="text-red-500 text-sm mt-2">
                      Please agree to all required terms
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating Listing...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Listing</span>
                      <CheckCircleIcon className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateListing;