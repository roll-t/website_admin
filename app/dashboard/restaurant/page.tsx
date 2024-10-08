"use client";
import { fetchRestaurant } from '@/app/lib/data'; // Import your function to fetch users
import { RestaurantModel } from '@/app/lib/models'; // Import your UserModel
import Search from '@/app/ui/dashboard/search/search';
import Pagination from '@/app/ui/shared/pagination/pagination';
import styles from '@/app/ui/users/users.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const RestaurantPage = ({ searchParams }: any) => {
  const [restaurants, setRestaurant] = useState<RestaurantModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  
  
  useEffect(() => {
    const getRestaurant = async () => {
      setLoading(true);
      try {
        const restaurantsList = await fetchRestaurant();
        setRestaurant(restaurantsList);
      } catch (err) {
        setError('Failed to fetch restaurant');
      } finally {
        setLoading(false);
      }
    };

    getRestaurant();
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <Search onSearch={handleSearch} />
        <button className={styles.btnAdd}>
          <Link href={'/dashboard/users/add'}>
            Add New
          </Link>
        </button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Restaurant name</td>
            <td>Email</td>
            <td>Status</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {restaurants.map((restaurant) => (
            <tr key={restaurant.idRestaurant}>
              <td className={styles.userName}>
                <div className={styles.avatvar}>
                  <img className={styles.avatarImage} src={restaurant.avatarUrl || '/restaurant.png'} alt="" />
                </div>
                {restaurant.nameRestaurant || "restaurant name"}
              </td>
              <td>{restaurant.emailRestaurant}</td>
              <td ><span className={restaurant.status} >{restaurant.status}</span></td>
              <td>
                <div className={styles.btns}>
                  <Link href={`/dashboard/restaurant/${restaurant.idRestaurant}`}>
                    <button className={`${styles.button} ${styles.view}`}>
                      View
                    </button>
                  </Link>
                  {/* <form>
                    <input type="hidden" value={restaurant.idRestaurant} name="_id" />
                    <button className={`${styles.button} ${styles.delete}`}>Delete</button>
                  </form> */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination count={3} />
    </div>
  );
};

export default RestaurantPage;
