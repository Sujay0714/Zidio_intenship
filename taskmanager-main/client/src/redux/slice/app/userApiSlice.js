// import { apiSlice } from "../apiSlice";

// const USER_URL = "/user";

// export const UserApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     updateUser: builder.mutation({
//       //mutation is used to post, put, update, delete
//       query: (data) => ({
//         //query is used to get the data or Get
//         url: `${USER_URL}/profile`,
//         method: "PUT",
//         body: data,
//         credentials: "include",
//       }),
//     }),

 

//     getTeamList: builder.query({
//       //query is used to get request
//       query: () => ({
//         //query is used to get the data or Get
//         url: `${USER_URL}/get-team`,
//         method: "GET",
//         credentials: "include",
//       }),
//     }),

//     deleteUser: builder.mutation({
//       query: (id) => ({
//         url: `${USER_URL}/${id}`,
//         method: "DELETE",
//         credentials: "include",
//       }),
//     }),

//     userAction: builder.mutation({
//       query: (data) => ({
//         url: `${USER_URL}/${data.id}`,
//         method: "PUT",
//         body: data,
//         credentials: "include",
//       }),
//     }),

//     getNotifications: builder.query({
//       query: () => ({
//         url: `${USER_URL}/notifications`,
//         method: "GET",
//         credentials: "include",
//       }),
//     }),

//     markNotiAsRead: builder.mutation({
//       query: (data) => ({
//         url: `${USER_URL}/read-noti?isReadType=${data.type}&id=${data?.id}`,
//         method: "PUT",
//         body: data,
//         credentials: "include",
//       }),
//     }),

//     changePassword: builder.mutation({
//       query: (data) => ({
//         url: `${USER_URL}/change-password`,
//         method: "PUT",
//         body: data,
//         credentials: "include",
//       }),
//     }),

//   }),
// });

// export const {
//   useUpdateUserMutation,
//   useGetTeamListQuery,
//   useDeleteUserMutation,
//   useUserActionMutation,
//   useGetNotificationsQuery,
//   useChangePasswordMutation,
//   useMarkNotiAsReadMutation,
//   // useRegisterUserTaskMutation,
// } = UserApiSlice;
