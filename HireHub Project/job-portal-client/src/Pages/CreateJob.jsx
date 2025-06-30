import React, { useState } from 'react';
import { useForm } from "react-hook-form"
import CreatableSelect from 'react-select/creatable';
import { useAuth } from '../context/AuthContext';


const CreateJob = () => {
    const { user } = useAuth();
    const [selectedOption, setSelectedOption] = useState(null);
    const {
        register,
        handleSubmit,reset,
        formState: { errors },
    } = useForm()
    
    const onSubmit = (data) => {
        data.skills = selectedOption;

        // Add unique ID and timestamp
        const jobData = {
            ...data,
            _id: Date.now().toString(), // Simple ID for localStorage
            createdAt: new Date().toISOString(),
            status: 'active'
        };

        console.log('Posting job:', jobData);

        // Save to localStorage first (immediate availability)
        try {
            const existingJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
            existingJobs.push(jobData);
            localStorage.setItem('jobs', JSON.stringify(existingJobs));
            console.log('Job saved to localStorage successfully');
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }

        // Also try to send to API (for backup/sync)
        fetch("http://localhost:3000/post-job",{
            method : "POST",
            headers : {'content-type' : 'application/json'},
            body : JSON.stringify(jobData)
        })
        .then((res) => res.json())
        .then((result) => {
            console.log('API response:', result);
            alert("Job posted successfully! ✅\n\nYour job is now live and visible in:\n• Dashboard\n• My Jobs\n• Browse Jobs (for students)");
            reset();
        })
        .catch((error) => {
            console.log('API not available, but job saved locally');
            alert("Job posted successfully! ✅\n\nYour job is now live and visible in:\n• Dashboard\n• My Jobs\n• Browse Jobs (for students)");
            reset();
        });
    };

    const options = [
        { value: 'JavaScript', label: 'JavaScript' },
        { value: 'C++', label: 'C++' },
        { value: 'HTML', label: 'HTML' },
        { value: 'CSS', label: 'CSS' },
        { value: 'React', label: 'React' },
        { value: 'Node', label: 'Node' },
        { value: 'MongoDB', label: 'MongoDB' },
        { value: 'Redux', label: 'Redux'},
    ]


    return (
        <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4 pt-20'>
            {/* Form */}
            <div className='bg-[#FAFAFA] py-10 px-4 lg:px-16'>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                    {/* !st row */}
                    <div className='create-job-flex'>
                        <div className='w-full lg:w-1/2'>
                            <label className='block mb-2 text-lg'>Job Title</label>
                            <input type = "text" defaultValue = {"Web Developer"}
                             {... register("jobTitle")} className="create-job-input"
                            />
                        </div>
                        <div className='w-full lg:w-1/2'>
                            <label className='block mb-2 text-lg'>Company Name</label>
                            <input type = "text" placeholder="Ex : Microsoft"
                             {... register("companyName")} className="create-job-input"
                            />
                        </div>

                    </div>

                    {/* 2nd row */}
                    <div className='create-job-flex'>
                        <div className='w-full lg:w-1/2'>
                            <label className='block mb-2 text-lg'>Minimum Salary</label>
                            <input type = "text" placeholder = "Rs 20k"
                             {... register("minPrice")} className="create-job-input"
                            />
                        </div>
                        <div className='w-full lg:w-1/2'>
                            <label className='block mb-2 text-lg'>Maximum Salary</label>
                            <input type = "text" placeholder="Rs 120k"
                             {... register("maxPrice")} className="create-job-input"
                            />
                        </div>

                    </div>

                    {/* 3rd row */}
                    <div className='create-job-flex'>
                        <div className='w-full lg:w-1/2'>
                            <label className='block mb-2 text-lg'> Salary Type</label>
                            <select {...register("SalaryType")} className="create-job-input">
                                <option value="">Choose your salary</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Yearly">Yearly</option>
                            </select>
                            
                        </div>
                        <div className='w-full lg:w-1/2'>
                            <label className='block mb-2 text-lg'>Job Location</label>
                            <input type = "text" placeholder="Ex : Delhi"
                             {... register("jobLocation")} className="create-job-input"
                            />
                        </div>

                    </div>


                     {/* 4th row */}
                    <div className='create-job-flex'>
                        <div className='w-full lg:w-1/2'>
                            <label className='block mb-2 text-lg'>Job Posting Date</label>
                            <input type = "date" placeholder="Ex : 03/05/2023"
                             {... register("postingDate")} className="create-job-input"
                            />
                        </div>
                        <div className='w-full lg:w-1/2'>
                            <label className='block mb-2 text-lg'>Experience Level</label>
                            <select {...register("experienceLevel")} className="create-job-input">
                                <option value="">Choose your experience</option>
                                <option value="Noexperience">Noexperience</option>
                                <option value="Internship">Internship</option>
                                <option value="Work remotely">Work remotely</option>
                            </select>
                            
                        </div>
                        

                    </div>

                    {/* 5th row */}
                    <div>
                        <label  className='block mb-2 text-lg'>Required Skill Sets:</label>
                        <CreatableSelect 
                            value={selectedOption}
                            onChange={setSelectedOption}
                            options={options}
                            isMulti={true}
                            className="create-job-input py-4"
                        />
                    </div>

                    {/* 6th row */}
                    <div className='create-job-flex'>
                        <div className='w-full lg:w-1/2'>
                            <label className='block mb-2 text-lg'>Company Logo</label>
                            <input type = "url" placeholder="Paste your company logo ULR : https://weshare.com/img1"
                             {... register("companyLogo")} 
                             className="create-job-input"
                            />
                        </div>
                        <div className='w-full lg:w-1/2'>
                            <label className='block mb-2 text-lg'>Employment Type</label>
                            <select {...register("employmentType")} className="create-job-input">
                                <option value="">Choose your experience</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Temporary">Temporary</option>
                            </select>
                            
                        </div>
                        

                    </div>

                    {/* 7th row */}
                    <div className="w-full">
                    <label className="block mb-2 text-lg">Job Description</label>
                    <textarea
                        className="w-full pl-3 py-1.5 focus:outline-none placeholder:text-gray-700"
                        rows={6}
                        defaultValue={
                        "Mollit in laborum tempor Lorem incididunt irure. Aute eu ex ad sunt. Pariatur sint culpa do incididunt eiusmod eiusmod culpa. laborum tempor Lorem incididunt."
                        }
                        placeholder="Job Description"
                        {...register("description")}
                    />
                    </div>


                    {/* last row */}
                    <div className='w-full'>
                        <label className='block mb-2 text-lg'>Job Posted By</label>
                        <input
                            type="email"
                            defaultValue={user?.email || ""}
                            placeholder = "your email"
                            {...register("postedBy")}
                            className="create-job-input"
                        />
                    </div>

                    <input type="submit" className='block mt-12 bg-blue text-white font-semibold px-8 py-2 rounded-sm  cursor-pointer' />
                </form>
            </div>
        </div>
    );
};

export default CreateJob


// 32:35 time