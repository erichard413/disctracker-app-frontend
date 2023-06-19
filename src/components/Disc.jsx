import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import DiscTrackerAPI from '../api';
import DiscCheck from './DiscCheck';

function Disc({discs, user}) {
    const {discId} = useParams();
    const [checkins, setCheckins] = useState();

    useEffect(()=>{
        async function fetchCheckins() {
           const result = await DiscTrackerAPI.getCheckins(discId);
           setCheckins(result); 
        }
        fetchCheckins();
    },[])

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
                {checkins && checkins.map(checkin => (
                <DiscCheck checkin={checkin} user={user} />
                ))}
        </div>
    )
}

export default Disc