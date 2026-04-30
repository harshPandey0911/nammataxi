import mongoose from 'mongoose';

const pricingSchema = new mongoose.Schema(
  {
    serviceType: {
      type: String,
      enum: ['airport', 'outstation', 'tours', 'local'],
      required: true,
    },
    tripMode: {
      type: String,
      // For airport: 'pickup' or 'drop'
      // For outstation: 'oneway' or 'roundtrip'
      // For tours: package name (e.g., '1day_100km')
      required: true,
    },
    vehicleCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VehicleCategory',
      required: true,
    },
    baseFare: {
      type: Number,
      required: true,
      default: 0,
    },
    perKmRate: {
      type: Number,
      required: true,
      default: 0,
    },
    minimumKm: {
      type: Number,
      default: 0,
    },
    driverAllowance: {
      type: Number,
      default: 0,
    },
    packagePrice: {
      // Used specifically for tours
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Ensure only one active pricing rule per service + mode + vehicle category combination
pricingSchema.index({ serviceType: 1, tripMode: 1, vehicleCategoryId: 1 }, { unique: true });

export default mongoose.model('Pricing', pricingSchema);
