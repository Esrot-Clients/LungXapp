import LungXinstance from "./server"

const getPatientListOfADoctor=({doctor_id,in_patient,out_patient})=>{
    return   LungXinstance.get(`api/patients/header/?doctor_id=${doctor_id}&in_patient=${in_patient}&out_patient=${out_patient}&start_date&end_date`).then(res=>res).catch(err=>err)
}

// const patientReportApi={
//     getPatientListOfADoctor
// } 

export default  getPatientListOfADoctor

