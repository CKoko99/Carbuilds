import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useHttpClient } from "../../../hooks/http-hook";
import Modal from "./Modal";
import classes from './Modal.module.css'

const Cars = [];

export default function NewVehicleModal(props) {
    const { isLoading, httpError, sendRequest, clearError } = useHttpClient()
    
    async function getVehiclesHandler() {
        try {
          const responseData = await sendRequest(
            "http://localhost:5000/api/v1/carbuilds/vehicles/",
            "GET",
            null,
            {
              "Content-Type": "application/json",
            }
          );
          for (let i = 0; i < responseData.vehiclesList.length; i++) {
            const makeFound = Cars.find(
              (element) => element.make === responseData.vehiclesList[i].make
            );
            if (makeFound) {
              const modelFound = makeFound.models.find(
                (element) => element === responseData.vehiclesList[i].model
              );
              if (!modelFound) {
                makeFound.models.push(responseData.vehiclesList[i].model);
              }
            } else {
              Cars.push({
                make: responseData.vehiclesList[i].make,
                models: [responseData.vehiclesList[i].model],
              });
            }
          }
          console.log(Cars);
        } catch (err) {}
        
      }
      useEffect(() => {
        getVehiclesHandler();
          // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      const [models, setModels] = useState([]);
  const [showMake, setShowMake] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [showCustomModel, setShowCustomModel] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const yearRef = useRef();
  const makeRef = useRef();
  const modelRef = useRef();
  const customModelRef = useRef();
  const years = Array.from(new Array(123), (x, i) => 2022 - i);
  const yearoptions = years.map((year) => {
    return <option value={year.toString()}>{year}</option>;
  });
  function showMakeHandler(event) {
    if (yearRef.current.value !== "-1") {
      setShowMake(true);
    } else {
      setShowMake(false);
    }
    showSubmitHandler();
  }
  function showModelHandler(event) {
    if (makeRef.current.value !== "-1") {
      setShowModel(true);
    } else {
      setShowModel(false);
    }
    const makeFound = Cars.find(
      (element) => element.make === makeRef.current.value
    );
    if (makeFound) {
      const matchingModels = makeFound.models.map((model) => {
        return (
          <option key={model} value={model}>
            {model}
          </option>
        );
      });
      setModels(matchingModels);
    } else {
      setModels(<></>);
    }
    showSubmitHandler();
  }
  function showCustomModelHandler(event) {
    if (modelRef.current.value === "0") {
      setShowCustomModel(true);
    } else {
      setShowCustomModel(false);
    }
    showSubmitHandler();
  }
  function showSubmitHandler() {
    if (showMake && showModel) {
      if (showCustomModel) {
        if (customModelRef.current.value.trim().length > 2) {
          setShowSubmit(true);
        } else {
          setShowSubmit(false);
        }
      } else {
        if (modelRef.current.value !== "-1" && modelRef.current.value !== "0") {
          setShowSubmit(true);
        } else {
          setShowSubmit(false);
        }
      }
    } else {
      setShowSubmit(false);
    }
  }
  function submitVehicle() {
    if (modelRef.current.value === "0") {
      props.submitVehicle({ make: makeRef.current.value, year: yearRef.current.value, model: customModelRef.current.value });
    }else{
        props.submitVehicle({ make: makeRef.current.value, year: yearRef.current.value, model: modelRef.current.value });
    }
    setShowMake(false)
    setShowModel(false)
    setShowCustomModel(false)
    setShowSubmit(false)
  }

    return <Modal title={"Add a New Vehicle"} close={props.close}>
        <>
        <div className={classes['vehicle-section']}>
        <label>Select Year: </label>
        <select
        class="form-control cg-carPicker-makerSelect maker-select-dropdown ft-make-selector"
        autocomplete="off"
        id="carPickerUsed_makerSelect"
        aria-label="Select Make"
        onChange={showMakeHandler}
        ref={yearRef}
      >
        <option value="-1">Year</option>
        {yearoptions}
      </select>
      </div>
      <div className={classes['vehicle-section']}>
      {showMake && (
          <>
          <label>Select Make: </label>
        <select
          class="form-control cg-carPicker-makerSelect maker-select-dropdown ft-make-selector"
          autocomplete="off"
          id="carPickerUsed_makerSelect"
          aria-label="Select Make"
          onChange={showModelHandler}
          ref={makeRef}
        >
          <option value="-1">All Makes</option>
          <optgroup label="Popular Makes">
            <option value="Acura">Acura</option>
            <option value="Alfa Romeo">Alfa Romeo</option>
            <option value="Audi">Audi</option>
            <option value="bmw">BMW</option>
            <option value="Buick">Buick</option>
            <option value="Cadillac">Cadillac</option>
            <option value="Chevrolet">Chevrolet</option>
            <option value="Chrysler">Chrysler</option>
            <option value="Dodge">Dodge</option>{" "}
            <option value="FIAT">FIAT</option>
            <option value="Ford">Ford</option>{" "}
            <option value="Genesis">Genesis</option>
            <option value="m26">GMC</option>{" "}
            <option value="Honda">Honda</option>
            <option value="Hyundai">Hyundai</option>
            <option value="INFINITI">INFINITI</option>
            <option value="Jaguar">Jaguar</option>{" "}
            <option value="Jeep">Jeep</option>
            <option value="Kia">Kia</option>
            <option value="Land Rover">Land Rover</option>
            <option value="Lexus">Lexus</option>
            <option value="Lincoln">Lincoln</option>
            <option value="Maserati">Maserati</option>
            <option value="Mazda">Mazda</option>
            <option value="Mercedes-Benz">Mercedes-Benz</option>
            <option value="MINI">MINI</option>
            <option value="Mitsubishi">Mitsubishi</option>
            <option value="Nissan">Nissan</option>
            <option value="Pontiac">Pontiac</option>
            <option value="Porsche">Porsche</option>{" "}
            <option value="RAM">RAM</option>
            <option value="Scion">Scion</option>{" "}
            <option value="Subaru">Subaru</option>
            <option value="Toyota">Toyota</option>
            <option value="Volkswagen">Volkswagen</option>
            <option value="Volvo">Volvo</option>
          </optgroup>
        </select>
        </>
      )}
      </div>
      <div className={classes['vehicle-section']}>
      {showMake && showModel && (
          <>
          <label>Select Model: </label>
        <select
          class="form-control cg-carPicker-makerSelect maker-select-dropdown ft-make-selector"
          autocomplete="off"
          id="carPickerUsed_makerSelect"
          aria-label="Select Make"
          onChange={showCustomModelHandler}
          ref={modelRef}
        >
          <option value="-1">Select Model</option>
          <option value="0">Create New Model</option>
          {models}
        </select>
        </>
      )}
      {showCustomModel && (
        <input onChange={showSubmitHandler} ref={customModelRef} type="text" />
      )}
      </div>
      <div className={classes['vehicle-section']}>
      {showSubmit && <button onClick={submitVehicle}>Create New Vehicle</button>}
      </div>
      </>
      
    </Modal>
}


