import LungXinstance from "./server"


const patchProfile=async()=>{
    
    return  LungXinstance.patch("/api/user_profile/",data)
    
    
}

const profielApi={
    patchProfile
} 

export default  profielApi

