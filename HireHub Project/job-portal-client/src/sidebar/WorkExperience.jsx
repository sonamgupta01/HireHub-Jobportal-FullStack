import React from 'react'
import InputField from '../components/InputField'


const WorkExperience = ({handleChange}) => {
  return (
      <div>
      <h4 className='text-lg font-medium mb-2'>Work Experience</h4>
      <div>
        <label className='sidebar-label-container'>
            <input type='radio' name="experience" id="experience-all" value="" onChange={handleChange}/>
            <span className='checkmark'></span>Any Experience
        </label>
        <InputField handleChange={handleChange} value="Internship"  title="Internship" name='experience'  />
        <InputField handleChange={handleChange} value="Work from home"  title="Work from home" name='experience'  />
      </div>
    
    </div>
  )
}

export default WorkExperience
