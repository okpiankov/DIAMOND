import { defineStore } from 'pinia'

export type TypeUser = {
  email: string | ''
  fullName: string | ''
  _id: string | ''
  role: string | ''
  phone?: string | ''
  createdAt: string | ''
  updatedAt: string | ''
  passwordHash: string | ''
  __v: number | 0
    // token: string | '' больше нет он скрыт в куках
}

const defaultvalue: TypeUser = {
  email: '',
  fullName: '',
  _id: '',
  role: '',
  phone: '',
  createdAt: '',
  updatedAt: '',
  passwordHash: '',
  __v: 0,
  // token: '', больше нет он скрыт в куках
}

export const useAuthStore = defineStore('auth', {
  //Здесь должен быть реальный стейт а не defaultvalue
  // state: () => defaultvalue, не верно!!!
  state: () => {
    return {
      email: '',
      fullName: '',
      _id: '',
      role: '',
      phone: '',
      createdAt: '',
      updatedAt: '',
      passwordHash: '',
      __v: 0,
    }
  },
  getters: {
    isAuth: (state) => state,
  },
  actions: {
    clear() {
      this.$patch(defaultvalue)
    },
    set(data: TypeUser) {
      this.$patch(data)
    },
  },
})

export const useIsLoadingStore = defineStore('isLoading', {
  state: () => ({
    isLoading: false,
  }),

  actions: {
    set(data: boolean) {
      this.$patch({ isLoading: data })
    },
  },
})

// type TAuthstore = {
//   email: string
//   name: string
//   status: boolean
// }

// const defaultvalue: { user: TAuthstore } = {
//   user: {
//     email: '',
//     name: '',
//     status: false,
//   },
// }
// export const useAuthstore = defineStore('auth', {
//   state: () => defaultvalue,
//   getters: {
//     isAuth: (state) => state.user.status,
//   },
//   actions: {
//     clear() {
//       this.$patch(defaultvalue)
//     },

//     set(input: TAuthstore) {
//       this.$patch({ user: input })
//     },
//   },
// })

// export  const useIsLoadingStore = defineStore('isLoading', {
//   state: () => ({
//     isLoading: true,
//   }),

//   actions: {
//     set(data: boolean) {
//       this.$patch({ isLoading: data })
//     },
//   },
// })

// // Is чтобы понять что это boolean значение
