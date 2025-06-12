import React, { useEffect } from 'react'
import api from '../axios';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await  api.get("api/frontend/courses");
                console.log(res.data.data)
            } catch (error) {
                
            }
        }
    },[])
  return (
    <div>
      
    </div>
  )
}

export default Courses
