import { defineStore } from 'pinia'

export type TypeCartObject = {
  image: string[]
  type: string
  name: string
  description: string
  price: number
  _id: string
  quantity: number
  createdAt: string
  updatedAt: string
  __v: number
}

type TypeCart = TypeCartObject[]
// const initialState = {cart: []}

export const useCartStore = defineStore('cart', {
  // state: () => {return []},
  //Здесь должен быть реальный стейт а не initialState
  // : { cart: TypeCart }
  state: (): { cart: TypeCart } => {
    return { cart: [] }
  },
  getters: {
    IsCart: (state) => state,
    //Логика подсчета общей стоимости с учетом quantity
    //total_cost: () => {...} через : не верно!
    total_cost(): number {
      const arrayPrices = this.cart.map((item) => item.price * item.quantity)
      return arrayPrices.reduce((sum, current) => sum + current, 0)
    },
  },
  actions: {
    add(product: TypeCartObject) {
      const cartProduct = this.cart.find((item) => item._id === product._id)
      if (!cartProduct) {
        this.cart.push({ ...product, quantity: 1 })
      } else {
        cartProduct.quantity++
      }
    },
    increment(product_id: string) {
      const product = this.cart.find((item) => item._id === product_id)
      if (product) {
        product.quantity++
      }
    },
    decrement(product_id: string) {
      const product = this.cart.find((item) => item._id === product_id)
      if (product) {
        product.quantity--
        if (product.quantity === 0) this.cart = this.cart.filter((item) => item._id !== product_id)
      }
    },
    delete(product_id: string) {
      this.cart = this.cart.filter((item) => item._id !== product_id)
    },

    clear() {
      // this.$patch({cart: []})
      this.cart = []
    },
  },
})


// if (cartProduct === undefined || typeof cartProduct.quantity !== 'number') return //сужение типа данных
// const arrayPrices = this.cart.map((item) =>
      //   typeof item.price === 'number' && typeof item.quantity === 'number'
      //     ? item.price * item.quantity
      //     : 0,
      // )

// export type TypeCartObject = {
//   image: null | string
//   type: null | string
//   name: null | string
//   description: null | string
//   price: null | number
//   id: null | number
//   quantity?: null | number
// }

// type TypeCart = TypeCartObject[]

// const initialState: TypeCart = []

// export const useCartStore = defineStore('cart', {
//   // state: () => {return []},
//   state: () => {return {cart:[]}},
//   getters: {
//     IsCart: (state) => state,
//   },
//   actions: {
//     clear() {
//       this.$patch({cart: initialState})
//     },
//     add(obj: TypeCartObject) {
//       this.cart.push(obj)
//     },
//     set(cart: TypeCart) {
//       //this.cart =[...cart]
//       // this.$patch([...cart])

//       this.$patch({cart: cart})
//     },
//   },
// })

// export type TypeCart = [
//   {
//     image: null | string
//     type: null | string
//     name: null | string
//     description: null | string
//     price: null | number
//     id: null | number
//     quantity?: null | number
//   },
// ]

// const initialState: TypeCart = [
//   {
//     image: null,
//     type: null,
//     name: null,
//     description: null,
//     price: null,
//     id: null,
//     quantity: null,
//   },
// ]

// IsCart: (state) => {
//     return { cart: state }
//   },

// set(input: TypeCart) {
//     this.$patch({cart: input})
//   },
