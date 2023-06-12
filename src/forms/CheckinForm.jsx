import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import DiscTrackerAPI from '../api';

import {
    Button,
    Form,
    FormGroup,
    Input,
    Label,
  } from 'reactstrap';

function CheckinForm({user, disc}) {
    const navigate = useNavigate();
    const initialFlash = ""
    const initialState = {courseName: "", city: "", state: "", zip: ""}
    const [flashMsg, setFlashMsg] =  useState(initialFlash);
    const [formData, setFormData] = useState(initialState);
    const [fetchState, setFetchState] = useState('fetch');
    const [courseSuggestions, setCourseSuggestions] = useState([]);
    const states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

    useEffect(()=>{
        async function fetchCourses() {
            const courses = await DiscTrackerAPI.getCourses(formData.courseName);
            setCourseSuggestions(courses);
        }
        if (fetchState === 'fetch') {
            fetchCourses();
        }
        setFetchState('fetch');
    }, [formData.courseName])

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(data => ({
            ...data,
            [name]: value
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        async function handleCheckIn() {
            await DiscTrackerAPI.doCheckIn(disc.id, formData);
        }
        handleCheckIn();
        navigate("/home", {replace: true});
    }

    const handleSuggestionClick = (course) => {
        setFetchState('clicked');
        setFormData(course);
        setCourseSuggestions([]);
    }
    return (
        <div className="CheckinForm">
            <h2>Disc# {disc.id}</h2>
            <p className='FlashMsg'>{flashMsg}</p>
                <Form className="form">
                <FormGroup>
                    <Label for="type">Course Name:</Label>
                    <Input 
                        name="courseName"
                        type="text"
                        placeholder="Course Name"
                        value={formData.courseName}
                        onChange={handleChange}
                    />
                </FormGroup>
                {formData.courseName.length > 1 && <div className="CheckinForm-suggestions">
                        {courseSuggestions.map(course=> (
                            <div className="suggestion" key={course.id} onClick={()=>handleSuggestionClick(course)}>
                                <p key={course.id}>{course.courseName}</p>
                            </div>
                        ))}
                    </div>}
                <FormGroup>
                    <Label for="type">City:</Label>
                    <Input name="city"
                        type="text"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="state">State:</Label>
                    <Input
                        name="state"
                        type="select"
                        placeholder="Your state"
                        value={formData.state}
                        onChange={handleChange}
                    >
                        {states.map(state=> (<option key={state}>{state}</option>))}
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="type">Zip:</Label>
                    <Input name="zip"
                        type="text"
                        placeholder="Zip"
                        value={formData.zip}
                        onChange={handleChange}
                    />
                </FormGroup>  

                <Button type="submit" onClick={handleSubmit}>Submit</Button>
            </Form>
        </div>
    )
}

export default CheckinForm