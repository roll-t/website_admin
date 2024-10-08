
import React from 'react';

const Test = () => {
    const handleForm = async (formData:any)=>{
        'use server'
        const data = formData.get('username')
        console.log("hello",data);
    }
    return (
        <div>
            <form action={handleForm}>
            <input type="text" name='username' />
            <button type="submit">submit</button>
            </form>

        </div>
    );
};

export default Test;