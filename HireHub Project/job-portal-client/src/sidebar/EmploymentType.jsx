import React from 'react'
import InputField from '../components/InputField'


const EmploymentType = ({handleChange}) => {
  return (
    <div>
      <h4 className='text-lg font-medium mb-2'>Employment Type</h4>
      <div>
        <label className='sidebar-label-container'>
            <input type='radio' name="employment" id="employment-all" value="" onChange={handleChange}/>
            <span className='checkmark'></span>All
        </label>
        <InputField handleChange={handleChange} value="Temporary"  title="Temporary" name='employment'  />
        <InputField handleChange={handleChange} value="Part-time"  title="Part-time" name='employment'  />
        <InputField handleChange={handleChange} value="Full-time"  title="Full-time" name='employment'  />
        
      </div>
    
    </div>
  )
}

export default EmploymentType
