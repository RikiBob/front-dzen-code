import * as yup from 'yup'

export const loginSchema = yup.object({
    email: yup.string()
        .trim()
        .required('Email is required')
        .email('Invalid email'),
    password: yup.string()
        .trim()
        .required('Password is required'),
})