import { useEffect, useRef, useState } from "react";

import { useHttpClient } from "../../../hooks/http-hook";
import { Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { useSelector } from "react-redux";
const Cars = [];
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }, paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    minWidth: "300px",
  },
}));

export default function NewVehicleModal(props) {
  const classes = useStyles();
  const { sendRequest } = useHttpClient()
  const authSelector = useSelector((state) => state.auth);
  function closeModalHandler() {
    props.close()
  }
  function closeAndRefreshModalHandler() {
    props.closeAndRefresh()
  }
  async function getVehiclesHandler() {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/vehicles/`,
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
    } catch (err) { }

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
  const yearoptions = years.map((year, index) => {
    return <option key={index} value={year.toString()}>{year}</option>;
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
  async function submitVehicle() {
    try {
      const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/vehicles`, 'POST', JSON.stringify({
        userId: authSelector.userId,
        model: (modelRef.current.value === "0" ? customModelRef.current.value : modelRef.current.value),
        year: yearRef.current.value,
        make: makeRef.current.value
      }), {
        'Content-Type': 'application/json',
        Authorization: "Bearer " + authSelector.token
      })

      console.log(responseData)
      closeAndRefreshModalHandler()

    } catch (err) {
    }
  }

  return <Modal
    disableEnforceFocus
    open={true}
    onClose={closeModalHandler}
    className={classes.modal}
  >
    <Box className={classes.paper} sx={{ display: "flex", flexDirection: "column" }}>
      <div className={classes['vehicle-section']}>
        <label>Select Year: </label>
        <select
          className="form-control cg-carPicker-makerSelect maker-select-dropdown ft-make-selector"
          autoComplete="off"
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
              className="form-control cg-carPicker-makerSelect maker-select-dropdown ft-make-selector"
              autoComplete="off"
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
              className="form-control cg-carPicker-makerSelect maker-select-dropdown ft-make-selector"
              autoComplete="off"
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
    </Box>


  </Modal>
}


