import * as yup from "yup";

export const editProfileSchema = yup.object({
    userName: yup.string()
        .trim()
        .matches(/^[a-zA-Z0-9]+$/, 'Username must be alphanumeric'),
    password: yup.string()
        .trim()
})