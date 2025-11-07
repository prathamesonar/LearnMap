const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  articles: [{
    id: String,
    title: String,
    source: String,
    url: String,
    difficulty: String,
    readTime: String,
    description: String,
  }],
  videos: [{
    id: String,
    title: String,
    source: String,
    url: String,
    duration: String,
    channel: String,
    description: String,
  }],
  books: [{
    id: String,
    title: String,
    author: String,
    year: Number,
    rating: Number,
    description: String,
  }],
  courses: [{
    id: String,
    title: String,
    platform: String,
    price: String,
    rating: Number,
    students: String,
    description: String,
  }],
}, { _id: false });

const MapSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: [true, 'Topic is required'],
    trim: true,
    lowercase: true,
    index: true,
  },
  level: {
    type: String,
    required: [true, 'Level is required'],
    enum: {
      values: ['Beginner', 'Intermediate', 'Advanced'],
      message: 'Level must be Beginner, Intermediate, or Advanced'
    },
    index: true,
  },
  mapData: {
    type: Object,
    required: [true, 'Map data is required'],
  },
  flowNodes: {
    type: Array,
    required: [true, 'Flow nodes are required'],
  },
  flowEdges: {
    type: Array,
    required: [true, 'Flow edges are required'],
  },
  resources: [
    {
      nodeId: {
        type: String,
        required: true,
      },
      data: ResourceSchema,
    }
  ],
  views: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { 
  timestamps: true,
  collection: 'learning_maps'
});

// Compound index for uniqueness
MapSchema.index({ topic: 1, level: 1 }, { unique: true });

// Auto-update updatedAt
MapSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Helper method to get resources for a specific node
MapSchema.methods.getNodeResources = function(nodeId) {
  const resourceItem = this.resources.find(r => r.nodeId === nodeId);
  return resourceItem ? resourceItem.data : null;
};

// Helper method to add/update resources for a node
MapSchema.methods.setNodeResources = function(nodeId, resourceData) {
  const existingIndex = this.resources.findIndex(r => r.nodeId === nodeId);
  if (existingIndex >= 0) {
    this.resources[existingIndex].data = resourceData;
  } else {
    this.resources.push({
      nodeId,
      data: resourceData,
    });
  }
};

module.exports = mongoose.model('Map', MapSchema);