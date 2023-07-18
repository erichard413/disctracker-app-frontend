import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import DiscTrackerAPI from '../api';
import DiscCheck from './DiscCheck';

function Disc({discs, user}) {
    const {discId} = useParams();
    const [checkins, setCheckins] = useState();
    const [loadState, setLoadState] = useState('load');
    const [page, setPage] = useState(1);
    
    useEffect(()=>{
        async function fetchCheckins() {
           try {
                const results = await DiscTrackerAPI.getCheckins(discId, 5, page);
                const distance = await DiscTrackerAPI.getDistanceForDisc(discId);
                setCheckins({...results, distance});  
           } catch (err) {
                console.log(err)
           } 
           setLoadState('ready'); 
        }
        fetchCheckins();
    },[page])

    if (loadState !== 'ready') {
        return (<div>
            Loading..
        </div>)
    }

    if (discs && !discs.some(disc => +disc.id === +discId)) {
        return (
            <div>
                <p>404 - Disc not found</p>
            </div>
        )
    }

    const incrementPage = () => {
        if (page < checkins.endPage) setPage(page+1);
    }
    const decrementPage = () => {
        if (page > 1) setPage(page-1);
    }
    
    let isPrev;
    let isNext;

    if (checkins) {
        isPrev = checkins.previous ? false : true;
        isNext = checkins.next ? false : true;
    }  else {
        isPrev = true;
        isNext = true;
    }
    
    return(
        <div className="Disc">
            <p>{discId}</p>
                {checkins && <p>This disc has travelled {Math.round(checkins.distance)} miles!</p>}
                {!checkins && <p>No check ins found for this disc!</p>}
                <button onClick={decrementPage} disabled={isPrev}>prev</button>
                        <span>{page}</span>
                <button onClick={incrementPage} disabled={isNext}>next</button>
                {checkins && checkins.results.map(checkin => (
                <DiscCheck key={checkin.id} checkin={checkin} user={user} />
                ))}
        </div>
    )
}

export default Disc