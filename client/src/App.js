// import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/navbar/navbar.jsx';
import Cards from './components/team/Cards.jsx';
import MakeAComment from './components/Make_a_Comment/MakeAComment';
import SecondLogin from './components/SecondLogin/SecondLogin';
import Fill from './components/Fill_Details/Fill';
import Homepage from './components/Homepage/Homepage';
import { Route, Routes, Navigate, BrowserRouter, Router, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import jwt_decode from "jwt-decode";
import { LoginContext } from './helpers/Context';
import axios from 'axios';
import alumniData from './components/navbar/akumniData.json'
import About from './components/About/About';
import Footer from './components/Footer/Footer';
function App() {

  const[user, setUser] = useState({}); //the one who logged in
  const[loggedin, setLoggedin] = useState(false);
  const[authData, setAuthData] = useState([]); //all the users wha have already logged in
  const[result, setResult] = useState({});
  const [isRegistered, setIsRegistered] = useState(false);
  const [found, setFound]= useState(false);
  const [loading, setLoading] = useState(true);

   //getting all alumnis from json
   const alumniEmail= alumniData; //geeting all the alumnis data

   const navigate = useNavigate();

  //Google authentication for IITI students
  useEffect(()=>{
    /*global google*/
    if(window.google){
      google.accounts.id.initialize({
      client_id: "279659903183-6ctccbqdo4skcudgca030m3uti3at58i.apps.googleusercontent.com",
      callback: handleCallbackResponse

    });
    google.accounts.id.renderButton(
      document.getElementById("google-login"),
      {theme: "outline", size: "medium", width: "large"}
    );
    }
  }, []);

  //getting all users who have already signed in
  useEffect(()=>{
    axios.get('http://localhost:5000/auth')
      .then((res)=>{
        setAuthData(res.data);
        console.log(authData)
      })
      .catch((err)=>{
        console.log(err);
      })
}, []);

//Callback Function after logging in
  async function handleCallbackResponse(response){
    //getting all the data from google for the user who signs in
    var userObject = jwt_decode(response.credential);
    setUser(userObject);
    setLoggedin(true);
    //Storing the users data in the localStorage
    window.localStorage.setItem('user' ,JSON.stringify(userObject));
    window.localStorage.setItem('loggedin', true);
    //Rendering the signin button
    document.getElementById("google-login").hidden= true;

    const finds= setTimeout(()=>{authData.find(el=>el.email===userObject.email)},1000);

    setTimeout(()=>{
      console.log(finds);
      if(finds){
        if(alumniEmail.includes(userObject.email)){
          axios.post('http://localhost:5000/findAUser',{
            email:userObject.email
          }).then((res)=>{
            if(res.data.message === "User Found"){
              if(res.data.User[0].verified === true){
                console.log("verified");
                navigate('/profile');
                setLoading(true);
              }
              else{
                navigate('/fill');
                setLoading(true);
              }
            }else{
              navigate('/fill');
              setLoading(true);
            }
          })
          console.log("Second time sign in and alumni")
        }
        else{
          navigate('/');
          console.log("second time sign in and student");
        }
      }
      else{
        axios.post('http://localhost:5000/auth', {
          email: userObject.email,
          name: userObject.name,
        }).then((res)=>{
          console.log(res);
          if(alumniEmail.includes(userObject.email)){
            console.log("first time login and alumni");
            navigate('/fill');
            setLoading(true);
          }
          else{
            navigate('/');
            console.log("first time login and student");
          }
        }).catch((err)=>{
          console.log(err);
        })
      }
    }, 2000)
  }
    

  return (
    <LoginContext.Provider value={{loggedin, setLoggedin, user, setUser, authData, setAuthData, result, setResult, isRegistered, setIsRegistered, loading, setLoading}}>
    <div className="App overflow-x-hidden">
      <Navbar/>
      <Routes>
      <Route exact path="/" element={<Homepage/>} />
      <Route exact path="/fill" element={<Fill />} />
      <Route exact path="/profile" element={<SecondLogin />} />
      <Route exact path="/about" element={<About />} />
      <Route exact path="/team" element={<Cards />} />
      <Route exact path="/comment" element={<MakeAComment />} />
      </Routes>
      {!loading && <Footer/>}
    </div>
    </LoginContext.Provider>
  );
}
export default App;
