import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { getToken } from '@/lib/utils';

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();

    useEffect(()=>{
        const getAppliedJobs = async () => {
            try {
                const token = getToken();
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                console.log(res.data);
                if(res.data.success){
                    dispatch(setAllAppliedJobs(res.data.application));
                }
            } catch (error) {
                console.log(error);
            }
        }
        getAppliedJobs();
    },[])
};
export default useGetAppliedJobs;