import React from 'react'
import InputField from '../components/InputField'

const Location = ({handleChange}) => {
  return (
    <div>
      <h4 className='text-lg font-medium mb-2'>Location</h4>
      <div>
        <label className='sidebar-label-container'>
            <input type='radio' name="location" id="location-all" value="" onChange={handleChange}/>
            <span className='checkmark'></span>All
        </label>
        <InputField handleChange={handleChange} value="Bangalore"  title="Bangalore" name='location'  />
        <InputField handleChange={handleChange} value="Chennai"  title="Chennai" name='location'  />
        <InputField handleChange={handleChange} value="Delhi"  title="Delhi" name='location'  />
        <InputField handleChange={handleChange} value="Hyderabad"  title="Hyderabad" name='location'  />
        <InputField handleChange={handleChange} value="Kolkota"  title="Kolkota" name='location'  />
        <InputField handleChange={handleChange} value="Pune"  title="Pune" name='location'  />
        <InputField handleChange={handleChange} value="Remote"  title="Remote" name='location'  />
        
      </div>
    
    </div>
  )
}

export default Location
