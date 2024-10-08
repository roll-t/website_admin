
import { fetchSingleUser } from '@/app/lib/data';
import styles from '@/app/ui/users/singleUser/singleUser.module.css';
import ProductPage from '../../posts/page';

const SingleUserPage = async ({ params }: any) => {
    const { id } = params
    const user = await fetchSingleUser(id);
    
    return (
        <>
            <div className={styles.container}>
                <div className={styles.infoContainer}>
                    <div className={styles.avatar}>

                        <img className={styles.avatarImage} src={user?.avatarUrl || '/user.png'} alt="" />
                    </div>
                    <h3>{user?.displayName || "user name"}</h3>
                </div>
                <div className={styles.formContainer}>
                    <form action="" className={styles.form}>
                        <label htmlFor="username">Username</label>
                        <input type="text" placeholder='username' value={user?.displayName} name='username' required />

                        <label htmlFor="email">Email</label>
                        <input type="mail" placeholder='email' value={user?.email} name="email" />

                        <label htmlFor="password">Create at</label>
                        <input type="text" placeholder='create at' value={user?.createdAt || '11/06/2024'} name="password" />

                        <button type="submit">Update</button>
                    </form>
                </div>
            </div>

            <div>
                <ProductPage userId={id}/>
            </div>
        </>
    );
};

export default SingleUserPage;