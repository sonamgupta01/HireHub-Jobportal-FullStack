import React, { useState } from 'react';
import InputField from '../components/inputField';

const JobPostingData = ({handleChange}) => {
  
  const now = new Date();
  const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);
  const SevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const ThirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const twentyFourHoursAgoDate = twentyFourHoursAgo.toISOString().slice(0, 10);
  const SevenDaysAgoDate = SevenDaysAgo.toISOString().slice(0, 10);
  const ThirtyDaysAgoDate = ThirtyDaysAgo.toISOString().slice(0, 10);



  return (
    <div>
      <h4 className="text-lg font-medium mb-2">Date of posting</h4>
      <div>
        <label className="sidebar-label-container">
          <input
            type="radio"
            name="posting-date"
            id="posting-date-all"
            value=""
            onChange={handleChange}
          />
          <span className="checkmark"></span>
          All time
        </label>

        <InputField
          handleChange={handleChange}
          value={twentyFourHoursAgoDate}
          title="Last 24 hours"
          name="posting-date"

        />
        <InputField
          handleChange={handleChange}
          value={SevenDaysAgoDate}
          title="Last 7 days"
          name="posting-date"

        />
        <InputField
          handleChange={handleChange}
          value={ThirtyDaysAgoDate}
          title="Last Month"
          name="posting-date"

        />
      </div>
    </div>
  );
};

export default JobPostingData;
