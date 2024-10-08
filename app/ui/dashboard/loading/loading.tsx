import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./loading.module.css";
const Loading = () => {
    return <div className={styles.loadingContainer}>
        <div className="spinner-border" role="status">
        </div>
    </div>
}

export default Loading;
