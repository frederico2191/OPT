import { useEffect, useState } from 'react';
import HomeView from './HomeView';
import { getStops } from '../../api';

const HomeContainer = () => {
  const [fetchedStops, setFetchedStops] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stops = await getStops();
        if (stops.error) {
          setError(true);
        } else {
          setFetchedStops(stops);
        }
      } catch (err) {
        console.log('Error fetching stops:', err);
        setError(true);
      }
    })();
  }, []);

  useEffect(() => {
    console.log("fetchedStops", fetchedStops);
  }, [fetchedStops]);

  console.log("fetchedStops33",fetchedStops);

  return <HomeView fetchedStops={fetchedStops} />;
 
};

export default HomeContainer;
