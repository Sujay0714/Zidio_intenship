import { apiSlice } from "../apiSlice";

const AUTH_URL = "/auth"

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({ //mutation is used to post, put, update, delete
            query: (data) => ({ //query is used to get the data or Get
                url: `${AUTH_URL}/login`,
                method: "POST",
                body: data,
                credentials: "include"
            })
        }),


        sendVerifyOtp: builder.mutation({
            query: ({ email }) => ({
              url: `${AUTH_URL}/send-verify-otp`,
              method: "POST",
              body: { email }, 
            }),
          }),
          

          verifyEmail: builder.mutation({
            query: (data) => ({
              url: `${AUTH_URL}/verify-email`, 
              method: "POST",                     
              body: data,               
            }),
          }),

          registerUserTask: builder.mutation({ //mutation is used to post, put, update, delete
            query: (data) => ({ //query is used to get the data or Get
                url: `${AUTH_URL}/registertask`,
                method: "POST",
                body: data,
                credentials: "include"
            })
        }),

          resendOtp: builder.mutation({
            query: (data) => ({
              url: "/auth/resend-otp",
              method: "POST",
              body: data,
            }),
          }),
          
          

        registerUser: builder.mutation({ //mutation is used to post, put, update, delete
            query: (data) => ({ //query is used to get the data or Get
                url: `${AUTH_URL}/register`,
                method: "POST",
                body: data,
                credentials: "include"
            })
        }),

        updateUser: builder.mutation({
          //mutation is used to post, put, update, delete
          query: (data) => ({
            //query is used to get the data or Get
            url: `${AUTH_URL}/profile`,
            method: "PUT",
            body: data,
            credentials: "include",
          }),
        }),
    
     
    
        getTeamList: builder.query({
          //query is used to get request
          query: () => ({
            //query is used to get the data or Get
            url: `${AUTH_URL}/get-team`,
            method: "GET",
            credentials: "include",
          }),
        }),
    
        deleteUser: builder.mutation({
          query: (id) => ({
            url: `${AUTH_URL}/${id}`,
            method: "DELETE",
            credentials: "include",
          }),
        }),
    
        userAction: builder.mutation({
          query: (data) => ({
            url: `${AUTH_URL}/${data.id}`,
            method: "PUT",
            body: data,
            credentials: "include",
          }),
        }),
    
        getNotifications: builder.query({
          query: () => ({
            url: `${AUTH_URL}/notifications`,
            method: "GET",
            credentials: "include",
          }),
        }),
    
        markNotiAsRead: builder.mutation({
          query: (data) => ({
            url: `${AUTH_URL}/read-noti?isReadType=${data.type}&id=${data?.id}`,
            method: "PUT",
            body: data,
            credentials: "include",
          }),
        }),
    
        changePassword: builder.mutation({
          query: (data) => ({
            url: `${AUTH_URL}/change-password`,
            method: "PUT",
            body: data,
            credentials: "include",
          }),
        }),

        sendResetPassword: builder.mutation({
          query: (email) => ({
            url: `${AUTH_URL}/send-reset-password-otp`,
            method: 'POST',
            body: {email},
          })
        }),
    
        resetPassword: builder.mutation({
          query: ({email, OTP, newPassword}) => ({
            url: `${AUTH_URL}/forget-password`,
            method: 'POST',
            body: {email, OTP, newPassword}
          })
        }),

        logout: builder.mutation({ 
            query: () => ({ 
                url: `${AUTH_URL}/logout`,
                method: "POST",
                credentials: "include"
            })
        })
    })
})

export const {useLoginMutation, useRegisterUserMutation, useRegisterUserTaskMutation, useLogoutMutation, useResendOtpMutation, useSendVerifyOtpMutation,   useUpdateUserMutation,
  useGetTeamListQuery,
  useDeleteUserMutation,
  useUserActionMutation,
  useGetNotificationsQuery,
  useChangePasswordMutation,
  useMarkNotiAsReadMutation, 
  useVerifyEmailMutation,
  useResetPasswordMutation,
  useSendResetPasswordMutation
} = authApiSlice