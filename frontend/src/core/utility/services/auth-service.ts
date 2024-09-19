import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../shared/utility/services/axiosBaseQuery.service";
import { ISignUpForm } from "../models/signUp.model";
import { baseUrl } from "../../../../environments/environment";
import { ILoginForm } from "../models/login.model";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: axiosBaseQuery({
        baseUrl: baseUrl
    }),
    endpoints: (builder) => ({
        signUpSubmit: builder.mutation<any, ISignUpForm>({
            query: (signUpDetails) => ({
                url:'/auth/register',
                method: "POST",
                data: signUpDetails
            }),
        }),
        loginUser: builder.mutation<any, ILoginForm>({
            query: ( userData ) => ({
            url: "/auth/login",
              method: "POST",
              data: userData,
              
            }),
            invalidatesTags:[]
          }),
    }),
})

export const {
    useSignUpSubmitMutation,
    useLoginUserMutation
} = authApi;