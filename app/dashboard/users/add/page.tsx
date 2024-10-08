import React from 'react';
import styles from '@/app/ui/users/addUsers/addUsers.module.css'
import { addUser } from './../../../lib/actions';
const AddUserPage = () => {
    return (
        <div className={styles.container}>
            <form action={addUser} className={styles.form}>
                <input type="text" placeholder='username' name='userName' required />
                <input type="mail" placeholder='email' name="email" />
                <input type="password" placeholder='password' name="password" />
                <input type="number" placeholder='phone' name="phone" />
                <select name="isAdmin" id="isAdmin">
                    <option value='false' selected>Is Admin</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
                <select name="isActive" id="isActive">
                    <option value='true' selected>Is Active</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
                <textarea
                    name="address"
                    id="address"
                    rows={10}
                    placeholder='Address'>
                </textarea>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default AddUserPage;