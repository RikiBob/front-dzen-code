import * as yup from 'yup'

export const registerSchema = yup.object({
    userName: yup.string()
        .trim()
        .required('Username is required')
        .matches(/^[a-zA-Z0-9]+$/, 'Username must be alphanumeric'),
    email: yup.string()
        .trim()
        .required('Email is required')
        .email('Invalid email'),
    password: yup.string()
        .trim()
        .required('Password is required'),
})