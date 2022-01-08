import request from "@/utils/request";


export const login = (data) => {
    return request({
        method: "post",
        url: "/mp/v1_0/authorizations",
        data
    })
}
export const getUserProfile = () => {
    // const user = JSON.parse(window.localStorage.getItem('user'))

    return request({
        method: "get",
        url: "/mp/v1_0/user/profile",
        // headers: {
        //     Authorization: `Bearer ${user.token}`
        // }
    })

}
export const updateUserInfo = () => {

}