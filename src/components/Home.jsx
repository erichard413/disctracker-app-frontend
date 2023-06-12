import React from 'react';

function Home({user}) {
    return (
        <div className="Home">
            <h1>I AM THE HOME PAGE</h1>
            {user && <p>{user.username} is logged in.</p>}
        </div>
    )
}

export default Home