import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchedQuery, addCustomFilter, removeCustomFilter, clearFilters } from '@/redux/jobSlice'

const fitlerData = [
    {
        fitlerType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        fitlerType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {
        fitlerType: "Salary",
        array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
    },
]

const customFilterTypes = [
    { label: 'Location', value: 'location' },
    { label: 'Industry', value: 'industry' },
    { label: 'Salary', value: 'salary' },
    { label: 'Title', value: 'title' },
    { label: 'Company', value: 'company' },
];

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const [customType, setCustomType] = useState('location');
    const [customValue, setCustomValue] = useState('');
    const dispatch = useDispatch();
    const customFilters = useSelector(store => store.job.customFilters) || [];

    const changeHandler = (value) => {
        setSelectedValue(value);
    }
    useEffect(()=>{
        dispatch(setSearchedQuery(selectedValue));
    },[selectedValue]);

    const handleAddCustomFilter = () => {
        if (customValue.trim() !== '') {
            dispatch(addCustomFilter({ type: customType, value: customValue.trim() }));
            setCustomValue('');
        }
    };

    const handleRemoveCustomFilter = (idx) => {
        dispatch(removeCustomFilter(idx));
    };

    return (
        <div className='w-full bg-white p-2 sm:p-3 rounded-md'>
            <h1 className='font-bold text-base sm:text-lg'>Filter Jobs</h1>
            <hr className='mt-3' />
            <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                <div>
                    <div className='flex items-center space-x-2 my-2'>
                        <RadioGroupItem value='SAVED_JOBS' id='saved-jobs-filter' />
                        <Label htmlFor='saved-jobs-filter' className='text-xs sm:text-base'>Saved Jobs</Label>
                    </div>
                </div>
                {
                    fitlerData.map((data, index) => (
                        <div key={index}>
                            <h1 className='font-bold text-base sm:text-lg'>{data.fitlerType}</h1>
                            {
                                data.array.map((item, idx) => {
                                    const itemId = `id${index}-${idx}`
                                    return (
                                        <div className='flex items-center space-x-2 my-2' key={itemId}>
                                            <RadioGroupItem value={item} id={itemId} />
                                            <Label htmlFor={itemId} className='text-xs sm:text-base'>{item}</Label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    ))
                }
            </RadioGroup>
            {/* Custom Filter Section */}
            <div className='mt-4'>
                <h2 className='font-semibold text-sm mb-2'>Custom Filters</h2>
                <div className='flex gap-2 mb-2'>
                    <select value={customType} onChange={e => setCustomType(e.target.value)} className='border rounded px-2 py-1 text-xs'>
                        {customFilterTypes.map(opt => (
                            <option value={opt.value} key={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <input
                        type='text'
                        value={customValue}
                        onChange={e => setCustomValue(e.target.value)}
                        placeholder='Enter value'
                        className='border rounded px-2 py-1 text-xs flex-1'
                        onKeyDown={e => { if (e.key === 'Enter') handleAddCustomFilter(); }}
                    />
                    <button onClick={handleAddCustomFilter} className='bg-[#7209b7] text-white px-2 py-1 rounded text-xs'>Add</button>
                </div>
                <div className='flex flex-wrap gap-2 mb-2'>
                    {customFilters.map((filter, idx) => (
                        <span key={idx} className='bg-gray-200 px-2 py-1 rounded text-xs flex items-center'>
                            {customFilterTypes.find(t => t.value === filter.type)?.label || filter.type}: {filter.value}
                            <button onClick={() => handleRemoveCustomFilter(idx)} className='ml-1 text-red-500' title='Remove'>&times;</button>
                        </span>
                    ))}
                </div>
                <button
                    onClick={() => {
                        setSelectedValue("");
                        dispatch(clearFilters());
                    }}
                    className='mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded text-xs w-full'>
                    Clear Filters
                </button>
            </div>
        </div>
    )
}

export default FilterCard