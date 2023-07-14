import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import DiscTrackerAPI from '../api';
import DiscCheck from './DiscCheck';
import { calcTotal } from '../helpers/doHaversine';

function Disc({discs, user}) {
    const {discId} = useParams();
    const [checkins, setCheckins] = useState();
    const [dist, setDist] = useState();

    useEffect(()=>{
        async function fetchCheckins() {
           const result = await DiscTrackerAPI.getCheckins(discId);
           setCheckins(result); 
        }
        fetchCheckins();
    },[])
    useEffect(()=> {
        function getDistance() {
            setDist(Math.round(calcTotal(checkins)));    
        }
        if (checkins) {
            getDistance();
        }
    }, [checkins])

    if (discs && !discs.some(disc => +disc.id === +discId)) {
        return (
            <div>
                <p>404 - Disc not found</p>
            </div>
        )
    }

    return(
        <div className="Disc">
            <p>{discId}</p>
                {dist > 0 && <p>This disc has travelled {dist} miles!</p>}
                {checkins && checkins.map(checkin => (
                <DiscCheck key={checkin.id} checkin={checkin} user={user} />
                ))}
        </div>
    )
}

export default Disc