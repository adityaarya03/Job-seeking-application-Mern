import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';


const Jobs = () => {
    const { allJobs, searchedQuery, customFilters } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const safeCustomFilters = Array.isArray(customFilters) ? customFilters : [];

    useEffect(() => {
        let jobs = Array.isArray(allJobs) ? allJobs : [];
        // Saved jobs filter
        if (searchedQuery === 'SAVED_JOBS') {
            if (user && user.savedJobs) {
                jobs = jobs.filter(job => user.savedJobs.includes(job._id));
            } else {
                jobs = [];
            }
        } else if (searchedQuery) {
            jobs = jobs.filter((job) => {
                return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchedQuery.toLowerCase())
            });
        }
        // Apply custom filters
        if (safeCustomFilters.length > 0) {
            jobs = jobs.filter(job => {
                return safeCustomFilters.every(filter => {
                    const val = filter.value.toLowerCase();
                    if (filter.type === 'location') {
                        return job.location?.toLowerCase().includes(val);
                    } else if (filter.type === 'industry') {
                        // Assuming job.description or job.title contains industry info
                        return job.title?.toLowerCase().includes(val) || job.description?.toLowerCase().includes(val);
                    } else if (filter.type === 'salary') {
                        return String(job.salary).toLowerCase().includes(val);
                    } else if (filter.type === 'title') {
                        return job.title?.toLowerCase().includes(val);
                    } else if (filter.type === 'company') {
                        return job.company?.name?.toLowerCase().includes(val);
                    }
                    return true;
                });
            });
        }
        setFilterJobs(jobs);
    }, [allJobs, searchedQuery, user, safeCustomFilters]);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5 px-2'>
                <div className='flex flex-col md:flex-row gap-5'>
                    <div className='w-full md:w-1/4'>
                        <FilterCard />
                    </div>
                    {
                        (Array.isArray(filterJobs) && filterJobs.length > 0) ? (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}>
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        ) : (
                            <span>Job not found</span>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Jobs