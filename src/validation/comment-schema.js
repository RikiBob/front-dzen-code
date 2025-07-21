import * as yup from 'yup'

export const commentSchema = yup.object({
    userName: yup.string()
        .trim()
        .required('Username is required')
        .matches(/^[a-zA-Z0-9]+$/, 'Username must be alphanumeric'),
    email: yup.string()
        .trim()
        .required('Email is required')
        .email('Invalid email'),
    homePage: yup.string().url('Invalid URL').notRequired(),
    text: yup.string()
        .required('Comment text is required')
        .test('no-script', 'Scripts are not allowed', value => !/<script.*?>.*?<\/script>/i.test(value))
})