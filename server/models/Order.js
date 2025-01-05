import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema(
  {
    goods: [
      {
        name: {
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
      },
    ],
    total_price: {
      type: Number,
      default: 0,
    },
    pay: String,
    delivery: String, 
    //Делаю связь заказа с юзером, здесь _id user
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true,
    },
  },

  {
    timestamps: true,
  },
)

export const OrderModel = mongoose.model('Order', OrderSchema)
