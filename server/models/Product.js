import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    image: [],
    // image: String,
  },
  {
    timestamps: true,
  },
);
//Добавил index для поиска  по name
ProductSchema.index({name: 'text'});
export const ProductModel = mongoose.model('Product', ProductSchema);