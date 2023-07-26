import { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import styled from 'styled-components';
import { AppContext } from '../App'
import useUserCheck from '../hooks/useUserCheck'

import { Button } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export default function Account() {
    const {validatedUserType, validToken, userID} = useUserCheck();
    const {setToken} = useContext(AppContext);
    const [editMode, setEditMode] = useState(false);
    const [account, setAccount] = useState({});
    const [supervisor, setSupervisor] = useState({});
    const [units, setUnits] = useState([]);
    const [firstname, setFirst] = useState(null);
    const [lastname, setLast] = useState(null);
    const [email, setEmail] = useState(null);
    const [unitid, setUnit] = useState(null);
    const [password, setPassword] = useState(null);
    const [rank, setRank] = useState(null);
    const [updated, setUpdated] = useState(false);
    useEffect(() => {
        fetchAccount();
        // fetchDuties();
        fetchUserDuties();
        fetchUnits();
    }, [userID, validatedUserType, updated]);

    useEffect(() => {
        fetchSupervisor();
    }, [account]);

    const fetchAccount = async () => {
        try {
            if(!userID)
            {
                return;
            }
            const response = await fetch(`http://localhost:4000/users/${userID}`);
            const data = await response.json();
            setAccount(data);
            setFirst(data.first_name);
            setLast(data.last_name);
            setEmail(data.email);
            setUnit(data.unit_id);
            setPassword(data.password);
            setRank(data.rank_id);
        } catch (error) {
            console.error('Error fetching user data', error);
        }
    };

    const fetchSupervisor = async () => {
        try {
            if(!userID)
            {
                return;
            }
            const response = await fetch(`http://localhost:4000/users/${account.supervisor_id}`);
            const data = await response.json();
            setSupervisor(data);
        } catch (error) {
            console.error('Error fetching supervisor data', error);
        }
    }

    const fetchUserDuties = async () => {
        try {
            const response = await fetch(`http://localhost:4000/duties/${user}`);
            const data = await response.json();
            setUserDuties(data);
        } catch (error) {
            console.error('Error fetching user duties', error);
        }
    }

    const Duties = () => (
        <DutiesList>
        {userDuties.map((duty) => (
            <DutyLi key={duty.id}>{duty.title}</DutyLi>
        ))}
        </DutiesList>
    );

    const fetchUnits = async () => {
        try {
            if(!userID)
            {
                return;
            }
            const response = await fetch(`http://localhost:4000/units/`);
            const data = await response.json();
            setUnits(data);
        } catch (error) {
            console.error('Error fetching the item', error);
        }
    }

    const handleEditModeOn = () => {
        setEditMode(true);
    }

    const handleConfirmEdit = () => {
        setEditMode(false);
    }

    const handleCancelEdit = () => {
        setEditMode(false);
    }

    const handleSubmitDetails = () => {
        handlePatch();
    }

    const handlePatch = () => {
        if(!password)
        {
            return;
        }
        return fetch(`http://localhost:4000/registration/${userID}`,{
            method:"PATCH",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({first_name: firstname, "last_name": lastname, "unit": unitid , password: password, rank_id: rank, email: email})
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    return res.json().then(data => { throw new Error(data.error) });
                }
            })
            .then(data=>{
                setToken(data.token)
                setUpdated(!updated);
            })
            .catch(err => {
                window.alert(err.message);
            });
    }
    console.log(account);
    return (
        <>
            {validatedUserType === 1 ?
                <AccountHeader>
                    <h1>Account Information</h1>
                    <span>Please enter missing account details</span>
                </AccountHeader>
                :
                <AccountHeader>
                    <h1>Account Information</h1>
                    {editMode ?
                        <div>
                            <CheckCircleIcon onClick={handleConfirmEdit}/>
                            <CancelIcon onClick={handleCancelEdit}/>
                        </div>
                        :
                        <EditIcon onClick={handleEditModeOn}/>
                    }
                </AccountHeader>
            }
            {editMode || validatedUserType === 1 ?
                <AccountInfoContainer>
                    <Row>
                        <Column>
                            <Label for="inputFirstName">First Name:</Label>
                            <InputAccountInfo onChange={(e)=>{setFirst(e.target.value)}} id="inputFirstName" type="text" value={firstname ?? account.first_name} required></InputAccountInfo>
                        </Column>
                        <Column>
                            <Label for="inputLastName">Last Name:</Label>
                            <InputAccountInfo onChange={(e)=>{setLast(e.target.value)}} id="inputLastName" type="text" value={lastname ?? account.last_name} required></InputAccountInfo>
                        </Column>
                    </Row>
                    <Row>
                        <Column>
                            <Row>
                            <Label>Rank</Label>
                                <SelectAccountInfo onChange={(e)=>{setRank(e.target.value)}} defaultValue="1" name="rank" id="agnosticRank">
                                    <option value="1">E-1</option><option value="2">E-2</option><option value="3">E-3</option>
                                    <option value="4">E-4</option><option value="5">E-5</option><option value="6">E-6</option>
                                    <option value="7">E-7</option><option value="8">E-8</option><option value="9">E-9</option>
                                    <option value="10">O-1</option><option value="11">O-2</option><option value="12">O-3</option>
                                    <option value="13">O-4</option><option value="14">O-5</option><option value="15">O-6</option>
                                    <option value="16">O-7</option><option value="17">O-8</option><option value="18">O-9</option>
                                    <option value="19">O-10</option>
                                </SelectAccountInfo>
                            </Row>
                        </Column>
                        <Column>
                            <Label for="inputPassword">Password (8 character minimum):</Label>
                            <InputAccountInfo onChange={(e)=>{setPassword(e.target.value)}} id="inputPassword" type="password" minlength="8" required></InputAccountInfo>
                        </Column>
                    </Row>
                    <Row>
                        <Column>
                            <Label for="selectUnit">Unit:</Label>
                            <SelectAccountInfo id="selectUnit" onChange={(e)=>{setUnit(e.target.value)}}required>
                                {units?.map((element, index)=>
                                {
                                    return (
                                        <option value={element.id}>{element.name}</option>
                                    )
                                })}
                            </SelectAccountInfo>
                        </Column>
                        <Column>
                            <Label for="selectDuties">Duties:</Label>
                            <SelectAccountInfo id="selectDuties" multiple required></SelectAccountInfo>
                        </Column>
                    </Row>
                </AccountInfoContainer>
                :
                <AccountInfoContainer>
                    <Row>
                        <Column>
                            <Label for="email">Email:</Label>
                            <AccountInfo id="email">{account.email}</AccountInfo>
                        </Column>
                    </Row>
                    <Row>
                        <Column>
                            <Label for="firstName">First Name:</Label>
                            <AccountInfo id="firstName">{account.first_name}</AccountInfo>
                        </Column>
                        <Column>
                            <Label for="lastName">Last Name:</Label>
                            <AccountInfo id="lastName">{account.last_name}</AccountInfo>
                        </Column>
                    </Row>
                    <Row>
                        <Column>
                            <Label for="rank">Rank:</Label>
                            <AccountInfo id="rank">{account.rank_name}</AccountInfo>
                        </Column>
                        <Column>
                            <Label for="supervisor">Supervisor:</Label>
                            <AccountInfo id="supervisor">{`${supervisor.first_name} ${supervisor.last_name}`}</AccountInfo>
                        </Column>
                    </Row>
                    <Row>
                        <Column>
                            <Label for="unit">Unit:</Label>
                            <AccountInfo id="unit">{account.unit_name}</AccountInfo>
                        </Column>
                        <Column>
                            <Label for="duties">Duties:</Label>
                            <AccountInfo id="duties">{Duties()}</AccountInfo>
                        </Column>
                    </Row>
                </AccountInfoContainer>
            }
            {validToken && (validatedUserType === 1 || editMode) ?
                <ButtonContainer>
                    <Button variant="contained" onClick={handleSubmitDetails} sx={{backgroundColor: 'MidnightBlue'}}>Submit Account Details</Button>
                </ButtonContainer>
                :
                <></>
            }
        </>
    )
}

const AccountHeader = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
padding: 10px;
`
const AccountInfoContainer = styled.div`
display: flex;
flex-direction: row;
flex-wrap: wrap;
`
const Row = styled.div`
display: flex;
justify-content: flex-start;
align-items: center;
width: 100%;
`
const Column = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: flex-start;
width: 50%;
height: 100px;
margin-left: 20px;
margin-right: 20px;
`
const AccountInfo = styled.span`
width: 50%;
`
const InputAccountInfo = styled.input`
align-self: stretch;
`
const SelectAccountInfo = styled.select`
align-self: stretch;
`
const Label = styled.label`
font-weight: 700;
`
const ButtonContainer = styled.div`
display: flex;
justify-content: center;
margin: 50px;
`
const DutiesList = styled.ul`
overflow: auto;
display: -webkit-box;
-webkit-line-clamp: 3;
line-clamp: 3;
-webkit-box-orient: vertical;
list-style-type: none;
`
const DutyLi = styled.li`
&:hover {
    background-color: WhiteSmoke;
}
`
