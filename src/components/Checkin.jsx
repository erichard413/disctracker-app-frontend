import React, {useState, useEffect} from 'react';
import CheckinForm from '../forms/CheckinForm';
import DiscTrackerAPI from '../api';
import {useParams} from 'react-router-dom';
import '../stylesheets/Checkin.css';

function Checkin({user}) {
    const {discId} = useParams();
    const [disc, setDisc] = useState();
    const [load, setLoad] = useState('load');

    useEffect(() => {
        async function fetchDisc() {
            const result = await DiscTrackerAPI.getDisc(discId);
            setDisc(result);
        }
        fetchDisc();
        setLoad('ready');
    },[])

    if (load === 'ready' && !disc) {
        return (
            <div>
                <p>404 - not found!</p>
            </div>
        )
    }

    return (
        <div className="Checkin">
            {disc && <CheckinForm user={user} disc={disc} />}
        </div>
    )
}

export default Checkin