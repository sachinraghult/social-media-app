import axios from 'axios';
import React, { useContext } from 'react';
import Sidebar from '../../component/sidebar/Sidebar';
import { Context } from '../../context/Context';
import './ConfirmDelete.css'

export default function ConfirmDelete() {

    const {user, dispatch} = useContext(Context);
    console.log("User id ", user.accessToken);
    const handleDelete = async () => {
        try {
            await axios.delete("/users/" + user._id,
                {headers: {authorization: "Bearer " + user.accessToken}},
            );
            dispatch({
                type:"LOGOUT",
            });
            window.location.replace("/");
        } catch (err) {
            
        }
    }

    return (
        <div className='confirmDelete'>
            <div className='confirmDeleteContainer1'>
                <h2>On deleting the account, all blogs posted by the user will also be deleted. 
                    Once the account is deleted, it cannot be retreived. 
                </h2>
                <button className="confirmSubmit" onClick={handleDelete}>
                    Delete
                </button>
            </div>
            <div className='confirmDeleteContainer2'>
                <Sidebar/>
            </div>
        </div>
    );
}