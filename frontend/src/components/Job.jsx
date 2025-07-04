import React, { useState } from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { setUser } from '@/redux/authSlice';
import { getToken } from '@/lib/utils';

const Job = ({job}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const isSaved = user?.savedJobs?.includes(job?._id);

    const handleSaveToggle = async () => {
        if (!user) {
            toast.error('Please login to save jobs.');
            return;
        }
        setLoading(true);
        try {
            const token = getToken();
            if (isSaved) {
                // Unsave job
                const res = await axios.post(`${USER_API_END_POINT}/unsave-job`, { jobId: job._id }, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                if (res.data.success) {
                    // Optimistically update user in Redux
                    dispatch(setUser({ ...user, savedJobs: user.savedJobs.filter(id => id !== job._id) }));
                    toast.success('Job removed from saved jobs.');
                }
            } else {
                // Save job
                const res = await axios.post(`${USER_API_END_POINT}/save-job`, { jobId: job._id }, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                if (res.data.success) {
                    dispatch(setUser({ ...user, savedJobs: [...(user.savedJobs || []), job._id] }));
                    toast.success('Job saved for later!');
                }
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference/(1000*24*60*60));
    }
    
    return (
        <div className='p-3 sm:p-5 rounded-md shadow-xl bg-white border border-gray-100'>
            <div className='flex items-center justify-between flex-wrap'>
                <p className='text-xs sm:text-sm text-gray-500'>{daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
                <Button variant="outline" className="rounded-full" size="icon" onClick={handleSaveToggle} disabled={loading || !user} title={isSaved ? 'Unsave Job' : 'Save Job'}>
                    <Bookmark fill={isSaved ? '#7209b7' : 'none'} />
                </Button>
            </div>

            <div className='flex items-center gap-2 my-2 flex-wrap'>
                <Button className="p-4 sm:p-6" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={job?.company?.logo} />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-base sm:text-lg'>{job?.company?.name}</h1>
                    <p className='text-xs sm:text-sm text-gray-500'>India</p>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-base sm:text-lg my-2'>{job?.title}</h1>
                <p className='text-xs sm:text-sm text-gray-600'>{job?.description}</p>
            </div>
            <div className='flex flex-wrap items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary}LPA</Badge>
            </div>
            <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 mt-4'>
                <Button onClick={()=> navigate(`/description/${job?._id}`)} variant="outline" className="w-full sm:w-auto">Details</Button>
                <Button onClick={handleSaveToggle} className={`bg-[#7209b7] w-full sm:w-auto ${isSaved ? 'opacity-70' : ''}`} disabled={loading || !user}>
                    {isSaved ? 'Saved' : 'Save For Later'}
                </Button>
            </div>
        </div>
    )
}

export default Job