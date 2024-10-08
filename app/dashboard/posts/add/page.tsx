
import { addProduct } from '@/app/lib/actions';
import styles from '@/app/ui/products/addProduct/addProduct.module.css';
const AddProductPage = () => {
    return (
        <div className={styles.container}>
            <form action={addProduct} className={styles.form}>
                <input type="text" placeholder='title' name='title' required/>
                <select name="cat" id="cat">
                    <option value="general">Chose a Category</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="phone">Phone</option>

                    <option value="computer">Computer</option>
                </select>
                <input type="number" placeholder='price' name="price" />
                <input type="number" placeholder='stock' name="stock" />
                <input type="text" placeholder='color' name="color" />
                <input type="text" placeholder='size' name="size" />
                <textarea
                 name="des"
                 id="des" 
                 rows={10} 
                 placeholder='Desctiption'>
                </textarea>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default AddProductPage;