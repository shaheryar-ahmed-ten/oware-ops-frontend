import React, { useEffect, useState } from 'react'


const Secret = () => {
    const [user, setUser] = useState();

    useEffect(() => {
        fetch("/api/secret", {
            header: {
                Authorization: "Bearer " + localStorage.getItem("token")
            },
        })
            .then(res => {
                return res.json()
            })
            .then(user => {
                setUser(user);
            })
            .catch(err => {
                console.log(err);
            })
    }, [])
    return (
        <div>

        </div>
    )
}

export default Secret
