import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import DiscTrackerAPI from '../../api';
import DiscCheck from '../DiscCheck';
import DeleteCheckinModal from './modals/DeleteCheckinModal';

function AllCheckins ({user}) {
    const navigate = useNavigate();
    const [checkins, setCheckins] = useState();
    const [loadState, setLoadState] = useState('load')
    const [page, setPage] = useState(1);
    const [modalState, setModalState] = useState(false);
    const [selectedCheckin, setSelectedCheckin] = useState();

    useEffect(()=>{
        if (localStorage.getItem('token') == null) {
          navigate('/home');
          return
        }
    }, [])

    useEffect(()=> {
        const fetchCheckins = async () => {
            const result = await DiscTrackerAPI.getAllCheckins(page, 15);
            setCheckins(result);
            setLoadState('ready');
        }
        fetchCheckins();
    }, [user, page])

    if (user && !user.isAdmin) {
        navigate('/', {replace: true})
        return;
    }

    if (loadState !== 'ready') {
        return (
            <div>
                Loading..
            </div>
        )
    }

    const incrementPage = () => {
        if (page < checkins.endPage) setPage(page+1);
    }
    const decrementPage = () => {
        if (page > 1) setPage(page-1);
    }

    const doDelete = (checkin) => {
        setSelectedCheckin(checkin);
        async function handleDelete() {
            const res = await DiscTrackerAPI.deleteCheckIn(checkin.id);
            return res;
        }
        if (user.isAdmin) handleDelete();
        setModalState(!modalState);
    }

    return (
        <div className="AllCheckins">
            <h3>All Check Ins</h3>
            <button onClick={decrementPage}>prev</button>
                        <span>{page}</span>
            <button onClick={incrementPage}>next</button>
            <ul>
                {checkins.results.map(checkin => (
                    <li key={checkin.id}>
                        <DiscCheck user={user} checkin={checkin} modalState={modalState} setModalState={setModalState} doDelete={doDelete} setSelectedCheckin={setSelectedCheckin} />
                    </li>
                ))}
            </ul>
            {(modalState &&  selectedCheckin) && <DeleteCheckinModal checkin={selectedCheckin} setModalState={setModalState} doDelete={doDelete} modalState={modalState} /> }
        </div>
    )
}

export default AllCheckins