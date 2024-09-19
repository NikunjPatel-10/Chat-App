import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../../shared/utility/services/axiosBaseQuery.service";
import {baseUrl} from '../../../../../environments/environment'

// const baseUrl = 'http://localhost:8080'
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: axiosBaseQuery({ baseUrl: baseUrl }),
  tagTypes: ['User'],
  endpoints: (builder) => ({

    searchUserData: builder.mutation<void, {search:any}>({
      query: (search) => ({
        url: `/search-user`,
        method: 'POST',
        data:search
      }),
      invalidatesTags: ['User'],
    }),
    getUserDetails : builder.query<any, {userId:any}>({
      query:({userId})=>({
        url:`/user/${userId}`,
        method:'GET'
      }),
      providesTags:['User']
    }), 
  }),
});

export const {useSearchUserDataMutation, useGetUserDetailsQuery } = userApi