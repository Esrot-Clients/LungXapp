import LungXinstance from "./server"


const getPatientList=async()=>{
    return  LungXinstance.get("/api/patients/")
}

const patientListApi={
    getPatientList
} 

export default  patientListApi

