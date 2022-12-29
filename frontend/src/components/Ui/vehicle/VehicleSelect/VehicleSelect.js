import { useEffect, useRef, useState } from "react";
import { useHttpClient } from "../../../../hooks/http-hook";

import MenuItem from '@mui/material/MenuItem';

import { Button, TextField } from "@mui/material";
import { CircularProgress, FormControl, Grid, Typography } from "@material-ui/core";


const Cars = [];

export default function VehicleSelect(props) {
  const { isLoading, httpError, sendRequest, clearError } = useHttpClient();

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

      console.log("here");
      console.log(responseData.vehiclesList);

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
  },[]);
  const [models, setModels] = useState([]);
  const [showMake, setShowMake] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [showCustomModel, setShowCustomModel] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");


  const customModelRef = useRef();
  const years = Array.from(new Array(123), (x, i) => 2022 - i);
  const yearMenuItems = years.map((year) => {
    return <MenuItem value={year.toString()}>{year}</MenuItem>;
  });
  function showMakeHandler(newSelectedYear) {
    if (newSelectedYear !== "") {
      setShowMake(true);
    } else {
      setShowMake(false);
    }
    showSubmitHandler();
  }
  function showModelHandler(newSelectedMake) {
    if (newSelectedMake !== "") {
      setShowModel(true);
    } else {
      setShowModel(false);
    }
    const makeFound = Cars.find(
      (element) => element.make === selectedMake
    );
    if (makeFound) {
      const matchingModels = makeFound.models.map((model) => {
        return (
          <MenuItem key={model} value={model}>
            {model}
          </MenuItem>
        );
      });
      setModels(matchingModels);
    } else {
      setModels(<></>);
    }
    showSubmitHandler();
  }
  function showCustomModelHandler(newSelectedModel) {
    if (newSelectedModel === "0") {
      setShowCustomModel(true);
    } else {
      setShowCustomModel(false);
    }
    showSubmitHandler();
  }
  function showSubmitHandler() {
    if (showMake && showModel) {
      if (showCustomModel) {
        console.log("here" + customModelRef.current.value.trim().length);
        if (customModelRef.current.value.trim().length > 1) {
          setShowSubmit(true);
        } else {
          setShowSubmit(false);
        }
      } else {
        if (selectedModel !== "" && selectedModel !== "0") {
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
    clearError();
    if (selectedModel === "0") {
      props.submitVehicle({ make: selectedMake, year: selectedYear, model: customModelRef.current.value });
    } else {
      props.submitVehicle({ make: selectedMake, year: selectedYear, model: selectedModel });
    }
    setShowMake(false)
    setShowModel(false)
    setShowCustomModel(false)
    setShowSubmit(false)
    setSelectedYear("")
    setSelectedMake("")
    setSelectedModel("")
  }
  function changeYearHandler(event) {
    setSelectedYear(event.target.value)
    showMakeHandler(event.target.value)
  }

  function changeMakeHandler(event) {
    setSelectedMake(event.target.value)
    showModelHandler(event.target.value)
  }
  function changeModelHandler(event) {
    setSelectedModel(event.target.value)
    showCustomModelHandler(event.target.value)
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {httpError && ( <Typography> {httpError}</Typography> )}
          <FormControl fullWidth>
            <TextField
              labelId="carPickerYear_label"
              label="Year"
              value={selectedYear}
              select
              onChange={changeYearHandler}

            >
              <MenuItem value=""></MenuItem>
              {yearMenuItems}
            </TextField>
          </FormControl>
        </Grid>
        {showMake && (

          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                id="carPickerMake_label"
                aria-label="Select Make"
                onChange={changeMakeHandler}
                value={selectedMake}
                select
                label="Make"
              >
                <MenuItem value=""></MenuItem>
                <MenuItem value="Acura">Acura</MenuItem>
                <MenuItem value="Alfa Romeo">Alfa Romeo</MenuItem>
                <MenuItem value="Audi">Audi</MenuItem>
                <MenuItem value="BMW">BMW</MenuItem>
                <MenuItem value="Buick">Buick</MenuItem>
                <MenuItem value="Cadillac">Cadillac</MenuItem>
                <MenuItem value="Chevrolet">Chevrolet</MenuItem>
                <MenuItem value="Chrysler">Chrysler</MenuItem>
                <MenuItem value="Dodge">Dodge</MenuItem>{" "}
                <MenuItem value="FIAT">FIAT</MenuItem>
                <MenuItem value="Ford">Ford</MenuItem>{" "}
                <MenuItem value="Genesis">Genesis</MenuItem>
                <MenuItem value="GMC">GMC</MenuItem>{" "}
                <MenuItem value="Honda">Honda</MenuItem>
                <MenuItem value="Hyundai">Hyundai</MenuItem>
                <MenuItem value="INFINITI">INFINITI</MenuItem>
                <MenuItem value="Jaguar">Jaguar</MenuItem>{" "}
                <MenuItem value="Jeep">Jeep</MenuItem>
                <MenuItem value="Kia">Kia</MenuItem>
                <MenuItem value="Land Rover">Land Rover</MenuItem>
                <MenuItem value="Lexus">Lexus</MenuItem>
                <MenuItem value="Lincoln">Lincoln</MenuItem>
                <MenuItem value="Maserati">Maserati</MenuItem>
                <MenuItem value="Mazda">Mazda</MenuItem>
                <MenuItem value="Mercedes-Benz">Mercedes-Benz</MenuItem>
                <MenuItem value="MINI">MINI</MenuItem>
                <MenuItem value="Mitsubishi">Mitsubishi</MenuItem>
                <MenuItem value="Nissan">Nissan</MenuItem>
                <MenuItem value="Pontiac">Pontiac</MenuItem>
                <MenuItem value="Porsche">Porsche</MenuItem>{" "}
                <MenuItem value="RAM">RAM</MenuItem>
                <MenuItem value="Scion">Scion</MenuItem>{" "}
                <MenuItem value="Subaru">Subaru</MenuItem>
                <MenuItem value="Toyota">Toyota</MenuItem>
                <MenuItem value="Volkswagen">Volkswagen</MenuItem>
                <MenuItem value="Volvo">Volvo</MenuItem>
              </TextField>
            </FormControl>
          </Grid>

        )}
        {showMake && showModel && (

          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                id="carPickerModel_label"
                onChange={changeModelHandler}
                value={selectedModel}
                select
                label="Model"
              >
                <MenuItem value="-1">Select Model</MenuItem>
                <MenuItem value="0">Create New Model</MenuItem>
                {models}
              </TextField>
            </FormControl>
          </Grid>

        )}
        {showCustomModel && (

          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField onChange={showSubmitHandler} label="Model" inputRef={customModelRef} type="text" />
            </FormControl>
          </Grid>

        )}
        {isLoading && <CircularProgress />}
        {showSubmit && <Grid container justifyContent="center">
          <Button variant="contained" onClick={submitVehicle}>submit</Button> </Grid>}
      </Grid>
    </>
  );
}
